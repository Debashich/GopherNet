import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `block px-6 py-3 transition-colors ${
      isActive(path)
        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
        : "text-gray-700 hover:bg-gray-50"
    }`;
  };

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">GopherNet</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <Link to="/admin" className={linkClass("/admin")}>
          <span className="flex items-center gap-3">
            <span>📊</span>
            <span>Dashboard</span>
          </span>
        </Link>
        
        <Link to="/admin/events" className={linkClass("/admin/events")}>
          <span className="flex items-center gap-3">
            <span>📅</span>
            <span>Event Manager</span>
          </span>
        </Link>
        
        <Link to="/admin/users" className={linkClass("/admin/users")}>
          <span className="flex items-center gap-3">
            <span>👥</span>
            <span>User Manager</span>
          </span>
        </Link>
        
        <Link to="/admin/scheduled" className={linkClass("/admin/scheduled")}>
          <span className="flex items-center gap-3">
            <span>⏰</span>
            <span>Scheduled Events</span>
          </span>
        </Link>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 border-t">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
