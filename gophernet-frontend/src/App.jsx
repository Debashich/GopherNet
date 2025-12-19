import { useEffect, useState, useRef } from "react";

/* ---------- NAVBAR ---------- */
function Navbar({ scrolled }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-white border-b border-slate-200"
          : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-700 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            GopherNet
          </h1>
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

/* ---------- HERO ---------- */
function Hero({ event }) {
  if (!event) return null;

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            {event.topic}
            <br />
            <span className="text-cyan-700">
              Event Automation
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            {event.message}. GopherNet delivers distributed, real-time
            notifications with reliability and precision.
          </p>

          <div className="flex gap-4 pt-2">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-blue-700 text-white text-sm font-semibold rounded-md hover:opacity-90">
              Start Free Trial
            </button>
            <button className="px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900">
              View Demo
            </button>
          </div>

          <p className="text-xs font-mono text-slate-500">
            {new Date(event.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- EVENT CARD ---------- */
function EventCard({ event }) {
  return (
    <div className="w-72 bg-white rounded-lg border border-slate-200 hover:border-cyan-600 transition">
      <div className="p-4 space-y-3">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-cyan-800 bg-cyan-100 rounded">
          {event.topic}
        </span>

        <p className="text-sm text-slate-800 leading-snug">
          {event.message}
        </p>

        <p className="text-xs font-mono text-slate-500">
          {new Date(event.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

/* ---------- EVENT SECTION ---------- */
function EventSection({ title, events }) {
  const scrollRef = useRef(null);
  if (!events.length) return null;

  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          {title}
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2"
        >
          {events.slice(0, 4).map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 text-sm">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-700 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                GopherNet
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Distributed event notification platform built for scale,
              reliability, and real-time delivery.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-slate-600">
                <li>Events</li>
                <li>Status</li>
                <li>Docs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-slate-600">
                <li>API</li>
                <li>Security</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-500">
          © 2025 GopherNet — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------- APP ---------- */
export default function App() {
  const [events, setEvents] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setEvents([
      { topic: "System", message: "Broker service healthy and operational", timestamp: new Date() },
      { topic: "Performance", message: "Latency reduced by 18%", timestamp: new Date() },
      { topic: "Database", message: "Event persisted successfully", timestamp: new Date() },
      { topic: "System", message: "New subscriber connected", timestamp: new Date() },
    ]);

    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const grouped = events.reduce((acc, e) => {
    acc[e.topic] = acc[e.topic] || [];
    acc[e.topic].push(e);
    return acc;
  }, {});

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar scrolled={scrolled} />

      <main>
        <Hero event={events[0]} />

        <EventSection title="Trending Now" events={events} />
        <EventSection title="System Events" events={grouped.System || []} />
        <EventSection title="Database Events" events={grouped.Database || []} />
        <EventSection title="Performance Events" events={grouped.Performance || []} />
      </main>

      <Footer />
    </div>
  );
}
