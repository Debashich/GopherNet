import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import EventSection from "../components/EventSection";
import { getRole } from "../auth";
import { Filter } from "lucide-react";

interface Event {
  id: number;
  topic: string;
  message: string;
  timestamp: Date;
  scheduled_at?: Date;
  isNew?: boolean;
  lane?: number; 
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

export default function Home() {
  const role = getRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [filterTopic, setFilterTopic] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch once
  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(r => r.json())
      .then(data => {
        const mapped: Event[] = data.map((e: any) => ({
          id: e.id,
          topic: e.topic,
          message: e.message,
          timestamp: new Date(e.timestamp),
          scheduled_at: e.scheduled_at ? new Date(e.scheduled_at) : undefined,
          lane: e.lane
        }));
        setEvents(mapped);
        if (mapped.length) {
          const latest = mapped[mapped.length - 1];
          setSelectedDate(toYMD(latest.scheduled_at ?? latest.timestamp));
        }
      });
  }, []);

  // WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/subscribe?topic=all`);

    ws.onmessage = (msg) => {
      const e = JSON.parse(msg.data);

      setEvents(prev => {
        if (prev.some(x => x.id === e.id)) return prev;

        return [
          ...prev,
          {
            id: e.id,
            topic: e.topic,
            message: e.message,
            timestamp: new Date(e.timestamp),
            scheduled_at: e.scheduled_at ? new Date(e.scheduled_at) : undefined,
            isNew: true
          }
        ];
      });

      setTimeout(() => {
        setEvents(prev =>
          prev.map(ev => ev.id === e.id ? { ...ev, isNew: false } : ev)
        );
      }, 1500);
    };

    return () => ws.close();
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stable sorted events
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const ta = (a.scheduled_at ?? a.timestamp).getTime();
      const tb = (b.scheduled_at ?? b.timestamp).getTime();
      return ta - tb;
    });
  }, [events]);

  // Live Events (latest 4)
  const liveEvents = sortedEvents.slice(-4).reverse();

  // Timeline filtering
  // Group events by lane number
  const timelineEvents = useMemo(() => {
    // Filter by date and topic
    const filtered = sortedEvents.filter(e => {
      const d = (e.scheduled_at ?? e.timestamp).toISOString().slice(0, 10);
      if (d !== selectedDate) return false;
      if (filterTopic !== "all" && e.topic !== filterTopic) return false;
      return true;
    });
    // Group by lane
    const lanes: Event[][] = [];
    filtered.forEach(e => {
      if (typeof e.lane === "number") {
        if (!lanes[e.lane]) lanes[e.lane] = [];
        lanes[e.lane].push(e);
      }
    });
    return lanes.filter(Boolean);
  }, [sortedEvents, selectedDate, filterTopic]);

  const topics = ["all", ...new Set(events.map(e => e.topic))];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar scrolled={scrolled} role={role} />

      <main>
        <Hero event={liveEvents[0]} />

        <EventSection title="Live Events" events={liveEvents} />

        {/* Timeline */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Event Timeline</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="space-y-4">
              {/* ...existing filter UI... */}
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-teal-600"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>

              {showFilters && (
                <select
                  value={filterTopic}
                  onChange={e => setFilterTopic(e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  {topics.map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            {/* 4. Timeline Feed: concurrency lanes */}
            <div className="lg:col-span-3 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {timelineEvents.map((lane, i) => (
                  <div key={i} className="w-72 space-y-4">
                    {lane.map(e => (
                      <div
                        key={e.id}
                        className={`bg-white p-4 rounded-lg border ${
                          e.isNew ? "ring-2 ring-teal-400" : ""
                        }`}
                      >
                        <div className="text-xs text-slate-500 mb-1">
                          Scheduled: {(e.scheduled_at ?? e.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                        </div>

                        <h3 className="font-semibold">{e.topic}</h3>
                        <p>{e.message}</p>

                        {e.scheduled_at && (
                          <div className="mt-2 text-xs text-teal-600">
                            ⏱ Scheduled Event
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
