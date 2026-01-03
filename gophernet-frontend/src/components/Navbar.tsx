import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { clearAuth } from "../auth";

interface NavbarProps {
  scrolled: boolean;
  role: string | null;
}

export default function Navbar({ scrolled, role }: NavbarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
    window.location.reload(); // Refresh to update state
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-white border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="GopherNet Logo" className="h-12 w-auto" />
          <h1 className="text-3xl font-bold text-[#0d3054]">GopherNet</h1>
        </Link>

        <div className="flex items-center gap-4">
          {role && (
            <span className="text-sm font-medium text-slate-600">
              Role: <span className={role === 'admin' ? 'text-blue-600' : ''}>{role}</span>
            </span>
          )}
          
          {/* Show Admin Panel link only for admin role */}
          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>⚙️</span>
              Admin Panel
            </Link>
          )}
          
          {role ? (
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign In
            </Link>
          )}
          
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
