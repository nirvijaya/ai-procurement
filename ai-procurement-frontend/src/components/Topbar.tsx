export default function Topbar() {
    return (
      <div className="h-16 bg-white shadow flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">Procurement Platform</h1>
  
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, User</span>
  
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }