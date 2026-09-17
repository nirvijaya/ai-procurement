const rfps = [
    { id: "RFP-001", category: "IT Services", status: "Open" },
    { id: "RFP-002", category: "Logistics", status: "Evaluation" },
    { id: "RFP-003", category: "Marketing", status: "Draft" },
  ];
  
  export default function RfpTable() {
    return (
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-2">RFP ID</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rfps.map((rfp) => (
            <tr key={rfp.id} className="border-b">
              <td className="py-2">{rfp.id}</td>
              <td>{rfp.category}</td>
              <td>
                <span className="px-2 py-1 text-xs bg-blue-100 rounded">
                  {rfp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }