import logo from "../assets/logo.png";

interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-white border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="GopherNet Logo" className="h-12 w-auto" />
          <h1 className="text-3xl font-bold text-[#0d3054]">GopherNet</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
