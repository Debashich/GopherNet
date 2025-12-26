import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import EventSection from "../components/EventSection";
import { getRole } from "../auth";

interface Event {
  topic: string;
  message: string;
  timestamp: Date;
}

export default function Home() {
  const [role] = useState<string | null>(getRole());
  const [events, setEvents] = useState<Event[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

    // 1. Load recent events via REST
    fetch(`${API_URL}/events?topic=System`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.map((e: any) => ({
          topic: e.topic,
          message: e.message,
          timestamp: new Date(e.timestamp)
        })));
      })
      .catch(console.error);

    // 2. Connect WebSocket for live updates
    const ws = new WebSocket(`${WS_URL}/subscribe?topic=System`);

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      setEvents((prev) => [
        {
          topic: data.topic,
          message: data.message,
          timestamp: new Date(data.timestamp),
        },
        ...prev,
      ]);
    };

    ws.onerror = (e) => console.error("WebSocket error", e);
    ws.onclose = () => console.log("WebSocket closed");

    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    return () => {
      ws.close();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar scrolled={scrolled} role={role} />

      <main>
        <Hero event={events[0]} />

        {/* SAME component, SAME layout */}
        <EventSection title="Live Events" events={events} />
      </main>

      <Footer />
    </div>
  );
}
