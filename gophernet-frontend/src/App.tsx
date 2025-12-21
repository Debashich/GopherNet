import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import EventSection from "./components/EventSection";

interface Event {
  topic: string;
  message: string;
  timestamp: Date;
}

/* ---------- APP ---------- */
export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
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

  const grouped = events.reduce<Record<string, Event[]>>((acc, e) => {
    acc[e.topic] = acc[e.topic] || [];
    acc[e.topic].push(e);
    return acc;
  }, {});

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar scrolled={scrolled} />

      <main>
        <Hero event={events[0]} />

        <EventSection title="Live Events" events={events} />
        <EventSection title="System Events" events={grouped.System || []} />
        <EventSection title="Database Events" events={grouped.Database || []} />
        <EventSection title="Performance Events" events={grouped.Performance || []} />
      </main>

      <Footer />
    </div>
  );
}
