export default function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards - placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Events</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Scheduled Events</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Published Today</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
