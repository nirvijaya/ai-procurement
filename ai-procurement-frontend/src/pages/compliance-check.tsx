import { useState } from "react";
import axios from "axios";

export default function Compliance() {
  const [rfp, setRfp] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!rfp) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/check-compliance", {
        rfp,
      });

      setResult(res.data.compliance);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compliance Check</h1>

        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Run Analysis
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">

        {/* LEFT: INPUT */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h2 className="font-semibold mb-3">RFP Input</h2>

          <textarea
            value={rfp}
            onChange={(e) => setRfp(e.target.value)}
            className="flex-1 border p-3 rounded resize-none"
            placeholder="Paste or generate RFP here..."
          />
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h2 className="font-semibold mb-3">Compliance Report</h2>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <p className="text-gray-400">Analyzing compliance...</p>
            ) : result ? (
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {result}
              </div>
            ) : (
              <p className="text-gray-400">
                Compliance insights will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}