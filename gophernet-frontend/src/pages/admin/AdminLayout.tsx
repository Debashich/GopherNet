import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">GopherNet Admin</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/events"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Event Manager
          </Link>
          <Link
            to="/admin/users"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            User Manager
          </Link>
          <Link
            to="/admin/scheduled"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Scheduled Events
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-6 py-3 text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
