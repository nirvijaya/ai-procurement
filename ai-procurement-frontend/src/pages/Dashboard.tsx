import Card from "../components/Card";
import RfpTable from "../components/RfpTable";
import SupplierQA from "../components/SupplierQA";
import AiActions from "../components/AiActions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">Procurement Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Active RFPs" value="12" />
        <Card title="Supplier Questions" value="34" />
        <Card title="Pending Compliance" value="5" />
        <Card title="Contracts in Review" value="3" />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFP Table */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Active RFPs</h2>
          <RfpTable />
        </div>

        {/* Supplier Q&A */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Supplier Q&A</h2>
          <SupplierQA />
        </div>
      </div>

      {/* AI Actions */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">AI Actions</h2>
        <AiActions />
      </div>
    </div>
  );
}