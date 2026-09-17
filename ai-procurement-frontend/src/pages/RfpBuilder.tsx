import { useState } from "react";
import axios from "axios";

export default function RfpBuilder() {
  const [form, setForm] = useState({
    category: "",
    budget: "",
    location: "",
    requirements: "",
  });

  const [generatedRfp, setGeneratedRfp] = useState("");

  // ✅ Dynamic fields state (FIXED POSITION)
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);
  const [dynamicValues, setDynamicValues] = useState<any>({});
  const [newField, setNewField] = useState({
    label: "",
    type: "text",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
  setLoading(true);

  try {
    const response = await axios.post("http://localhost:5000/generate-rfp", {
      category: form.category,
      budget: form.budget,
      location: form.location,
      requirements: form.requirements,
      dynamicFields: dynamicValues,
    });

    setGeneratedRfp(response.data.rfp);
  } catch (error) {
    console.error(error);
    setGeneratedRfp("Error generating RFP");
  }

  setLoading(false);
};

const handleDownload = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/download-rfp",
      { rfp: generatedRfp },
      { responseType: "blob" } // IMPORTANT
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "RFP.docx");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Download failed", error);
  }
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: FORM */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-xl font-bold">RFP Builder</h1>

        <input
          name="category"
          placeholder="Category (e.g. IT Services)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="budget"
          placeholder="Budget (e.g. 500k EUR)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location (e.g. EU)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        {/* 🔹 Dynamic Fields Render */}
        {dynamicFields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm mb-1">{field.label}</label>

            {field.type === "text" && (
              <input
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setDynamicValues({
                    ...dynamicValues,
                    [field.label]: e.target.value,
                  })
                }
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setDynamicValues({
                    ...dynamicValues,
                    [field.label]: e.target.value,
                  })
                }
              />
            )}

            {field.type === "textarea" && (
              <textarea
                className="w-full p-2 border rounded h-24"
                onChange={(e) =>
                  setDynamicValues({
                    ...dynamicValues,
                    [field.label]: e.target.value,
                  })
                }
              />
            )}
          </div>
        ))}

        {/* 🔹 Add Field UI */}
        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold">Add Custom Field</h2>

          <input
            placeholder="Field Label"
            className="w-full p-2 border rounded"
            value={newField.label}
            onChange={(e) =>
              setNewField({ ...newField, label: e.target.value })
            }
          />

          <select
            className="w-full p-2 border rounded"
            value={newField.type}
            onChange={(e) =>
              setNewField({ ...newField, type: e.target.value })
            }
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
          </select>

          <button
            onClick={() => {
              if (!newField.label) return;

              setDynamicFields([...dynamicFields, newField]);
              setNewField({ label: "", type: "text" });
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded"
          >
            + Add Field
          </button>
        </div>

        <textarea
          name="requirements"
          placeholder="Enter requirements..."
          className="w-full p-2 border rounded h-32"
          onChange={handleChange}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Generating..." : "Generate RFP with AI"}
        </button>
        
      </div>

      {/* RIGHT: OUTPUT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Generated RFP</h2>

        {generatedRfp ? (
          <textarea
            className="w-full h-[400px] border p-3 rounded"
            value={generatedRfp}
            onChange={(e) => setGeneratedRfp(e.target.value)}
          />
        ) : (
          <p className="text-gray-400">
            AI-generated RFP will appear here...
          </p>
        )}
        
      </div>
      <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download DOCX
        </button>
    </div>
  );
}