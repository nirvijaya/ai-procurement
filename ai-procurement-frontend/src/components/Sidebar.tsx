import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        AI Procurement
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>

        <Link
          to="/rfp-builder"
          className="block p-2 rounded hover:bg-gray-700"
        >
          RFP Builder
        </Link>

        <Link
          to="/supplier-portal"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Supplier Portal
        </Link>
        <Link
          to="/compliance-check"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Compliance Check
        </Link>
        <Link
          to="/bid-evaluation"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Bid Evaluation
        </Link>
        <Link
          to="/contract-generator"
          className="block p-2 rounded hover:bg-gray-700"
        >
          Contract Generator
        </Link>

      </nav>
    </div>
  );
}