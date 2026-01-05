import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../icons/Icon";


export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();


  // Fixed isActive function - checks if current path starts with the nav item path
  const isActive = (path: string) => {
    // Special handling for base /admin route - treat as events
    if (location.pathname === "/admin") {
      return path === "/admin/events";
    }
    // For other routes, check if pathname starts with the path
    return location.pathname.startsWith(path);
  };


  const navItems = [
    { path: "/admin/events", icon: "calendar", label: "Event Manager" },
    { path: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/admin/users", icon: "users", label: "User Manager" },
    { path: "/admin/scheduled", icon: "clock", label: "Scheduled Events" },
  ];


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
      {/* Sidebar - Enhanced Dark Theme with Gradient */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 shadow-2xl relative flex-shrink-0">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>


        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <Icon name="arrowLeft" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                GopherNet
              </h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
        </div>


        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive(item.path)
                  ? "bg-cyan-500/90 text-white border border-cyan-400/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              {/* Animated background on hover for non-active items */}
              {!isActive(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/40 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              )}



              <Icon name={item.icon} className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>


        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-slate-700/50">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-400 border border-red-500/30 rounded-xl hover:from-red-500/20 hover:to-rose-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 font-medium group"
          >
            <Icon name="logout" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>


      {/* Main content - Full Height Container */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
