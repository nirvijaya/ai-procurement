from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from docx import Document
from concurrent.futures import ThreadPoolExecutor
import os
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("AZURE_AI_KEY"),
    base_url="https://foundary1nir.services.ai.azure.com/api/projects/proj-default/openai/v1/"
)

model_name = os.getenv("AZURE_MODEL", "gpt-4o")


# ─── Specialist Agents ────────────────────────────────────────────────────────

def run_research_agent(category, budget, location):
    """Agent 1: Analyzes market context for the procurement category."""
    response = client.responses.create(
        model=model_name,
        input=[
            {
                "type": "message",
                "role": "system",
                "content": [{"type": "input_text", "text":
                    "You are a procurement market research specialist. "
                    "Analyze the given procurement category and provide market context, "
                    "typical vendor landscape, pricing benchmarks, and key considerations. "
                    "Be concise and structured."
                }]
            },
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text":
                    f"Category: {category}\nBudget: {budget}\nLocation: {location}\n\n"
                    "Provide market research context for this procurement."
                }]
            }
        ],
        temperature=0.2,
    )
    return response.output[0].content[0].text


def run_drafting_agent(category, budget, location, requirements, dynamic_fields, research_context):
    """Agent 2: Drafts the RFP using research context and inputs."""
    dynamic_text = "\n".join([f"{k}: {v}" for k, v in dynamic_fields.items()])

    response = client.responses.create(
        model=model_name,
        input=[
            {
                "type": "message",
                "role": "system",
                "content": [{"type": "input_text", "text":
                    "You are an expert RFP writer with deep procurement knowledge. "
                    "Draft professional, comprehensive RFP documents using the provided "
                    "market research context and requirements. Include all standard sections."
                }]
            },
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text":
                    f"Market Research Context:\n{research_context}\n\n"
                    f"Category: {category}\nBudget: {budget}\nLocation: {location}\n"
                    f"Requirements:\n{requirements}\n"
                    f"Additional Inputs:\n{dynamic_text}\n\n"
                    "Draft a comprehensive RFP with: Scope, Deliverables, "
                    "Evaluation Criteria, Compliance Requirements, Timeline."
                }]
            }
        ],
        temperature=0.3,
    )
    return response.output[0].content[0].text


def run_compliance_agent(rfp_draft):
    """Agent 3: Reviews the RFP draft for compliance gaps and regulatory issues."""
    response = client.responses.create(
        model=model_name,
        input=[
            {
                "type": "message",
                "role": "system",
                "content": [{"type": "input_text", "text":
                    "You are a procurement compliance specialist. "
                    "Review RFP drafts and identify missing compliance clauses, "
                    "regulatory requirements, and legal gaps. "
                    "Return specific additions and amendments needed."
                }]
            },
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text":
                    f"Review this RFP draft for compliance issues:\n\n{rfp_draft}"
                }]
            }
        ],
        temperature=0.2,
    )
    return response.output[0].content[0].text


def run_risk_agent(rfp_draft):
    """Agent 4: Identifies procurement risks and suggests mitigations."""
    response = client.responses.create(
        model=model_name,
        input=[
            {
                "type": "message",
                "role": "system",
                "content": [{"type": "input_text", "text":
                    "You are a procurement risk analyst. "
                    "Identify risks in RFP documents: vendor risks, scope risks, "
                    "budget risks, timeline risks, and suggest mitigation strategies. "
                    "Be concise and actionable."
                }]
            },
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text":
                    f"Identify risks in this RFP:\n\n{rfp_draft}"
                }]
            }
        ],
        temperature=0.2,
    )
    return response.output[0].content[0].text


def run_assembler_agent(rfp_draft, compliance_notes, risk_notes):
    """Agent 5: Assembles the final polished RFP from all agent outputs."""
    response = client.responses.create(
        model=model_name,
        input=[
            {
                "type": "message",
                "role": "system",
                "content": [{"type": "input_text", "text":
                    "You are a senior procurement document specialist. "
                    "Take an RFP draft and seamlessly incorporate compliance requirements "
                    "and risk mitigations into a final, polished document. "
                    "Do not duplicate content — integrate feedback naturally."
                }]
            },
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text":
                    f"RFP Draft:\n{rfp_draft}\n\n"
                    f"Compliance Notes to Incorporate:\n{compliance_notes}\n\n"
                    f"Risk Mitigations to Incorporate:\n{risk_notes}\n\n"
                    "Produce the final, complete RFP document."
                }]
            }
        ],
        temperature=0.3,
    )
    return response.output[0].content[0].text


# ─── Orchestrator ─────────────────────────────────────────────────────────────

def orchestrate_rfp_generation(category, budget, location, requirements, dynamic_fields):
    """
    Multi-agent pipeline:
      Agent 1 (Research) → Agent 2 (Drafting)
        → Agent 3 (Compliance) + Agent 4 (Risk) [parallel]
          → Agent 5 (Assembler)
    """
    # Agent 1: Market Research
    research_context = run_research_agent(category, budget, location)

    # Agent 2: RFP Drafting
    rfp_draft = run_drafting_agent(
        category, budget, location, requirements, dynamic_fields, research_context
    )

    # Agent 3 & 4: Compliance and Risk run in parallel
    with ThreadPoolExecutor(max_workers=2) as executor:
        compliance_future = executor.submit(run_compliance_agent, rfp_draft)
        risk_future = executor.submit(run_risk_agent, rfp_draft)
        compliance_notes = compliance_future.result()
        risk_notes = risk_future.result()

    # Agent 5: Final Assembly
    final_rfp = run_assembler_agent(rfp_draft, compliance_notes, risk_notes)

    return {
        "rfp": final_rfp,
        "agent_outputs": {
            "research": research_context,
            "draft": rfp_draft,
            "compliance": compliance_notes,
            "risks": risk_notes,
        }
    }


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.route("/")
def home():
    return {"status": "Backend running"}


@app.route("/generate-rfp", methods=["POST"])
def generate_rfp():
    data = request.json

    category       = data.get("category", "")
    budget         = data.get("budget", "")
    location       = data.get("location", "")
    requirements   = data.get("requirements", "")
    dynamic_fields = data.get("dynamicFields", {})

    try:
        result = orchestrate_rfp_generation(
            category, budget, location, requirements, dynamic_fields
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download-rfp", methods=["POST"])
def download_rfp():
    data = request.json
    rfp_text = data.get("rfp", "")

    doc = Document()
    for line in rfp_text.split("\n"):
        doc.add_paragraph(line)

    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    return send_file(
        file_stream,
        as_attachment=True,
        download_name="RFP.docx",
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@app.route("/api/supplier-qa", methods=["POST"])
def supplier_qa():
    data = request.json
    question = data.get("question", "")
    rfp_text = data.get("rfp", "")

    try:
        response = client.responses.create(
            model=model_name,
            input=[
                {
                    "type": "message",
                    "role": "system",
                    "content": [{"type": "input_text", "text":
                        "You are a procurement assistant helping suppliers understand an RFP. "
                        "Answer clearly and professionally based on the RFP context provided."
                    }]
                },
                {
                    "type": "message",
                    "role": "system",
                    "content": [{"type": "input_text", "text":
                        f"RFP Context:\n{rfp_text}"
                    }]
                },
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": question}]
                }
            ],
            temperature=0.3,
        )
        answer = response.output[0].content[0].text
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/check-compliance", methods=["POST"])
def check_compliance():
    data = request.json
    rfp_text = data.get("rfp", "")

    try:
        result = run_compliance_agent(rfp_text)
        return jsonify({"compliance": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
