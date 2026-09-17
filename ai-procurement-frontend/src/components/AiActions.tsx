export default function AiActions() {
    return (
      <div className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Generate RFP
        </button>
  
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Analyze Bids
        </button>
  
        <button className="px-4 py-2 bg-purple-600 text-white rounded">
          Check Compliance
        </button>
  
        <button className="px-4 py-2 bg-gray-800 text-white rounded">
          Draft Contract
        </button>
      </div>
    );
  }