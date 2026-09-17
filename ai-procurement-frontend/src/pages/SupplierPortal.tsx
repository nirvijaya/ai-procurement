import { useState } from "react";
import axios from "axios";

export default function SupplierQA() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/supplier-qa",{
        question: input,
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-xl font-bold mb-4">Supplier Q&A</div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto bg-white p-4 rounded shadow space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-xl ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask a question..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}