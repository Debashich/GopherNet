import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { getRole } from "../auth";
import { Filter, Clock, Calendar } from "lucide-react";

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

  const [selectedDate, setSelectedDate] = useState("");
  const [filterTopic, setFilterTopic] = useState("all");

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

  // Timeline filtering
  const timelineEvents = useMemo(() => {
    return sortedEvents.filter(e => {
      if (selectedDate) {
        const d = toYMD(e.scheduled_at ?? e.timestamp);
        if (d !== selectedDate) return false;
      }

      if (filterTopic !== "all" && e.topic !== filterTopic) return false;

      return true;
    });
  }, [sortedEvents, selectedDate, filterTopic]);

  const topics = ["all", ...new Set(events.map(e => e.topic))];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen">
      <Navbar scrolled={scrolled} role={role} />

      <main className="pb-20">
        <Hero event={sortedEvents[sortedEvents.length - 1]} />

        {/* Timeline Section with Sidebar */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                      Stay in the loop
                    </h3>
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">
                      Timeline for the event
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Join us for an unforgettable night filled with music and energy. Check out our upcoming events below!
                    </p>
                  </div>

                  {/* Get Tickets Button */}
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 rounded-xl font-bold hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-400/70 hover:shadow-cyan-300/90 hover:scale-105 transform">
                    GET TICKETS
                  </button>



                  {/* Filters Card */}
                  <div className="bg-[#0f1729] backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-2xl">
                    {/* Date Filter */}
                    <div className="mb-6">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                      />
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate("")}
                          className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>

                    {/* Topic Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                        <Filter className="w-4 h-4 text-cyan-400" />
                        Filter by Topic
                      </label>
                      <select
                        value={filterTopic}
                        onChange={e => setFilterTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                      >
                        {topics.map(t => (
                          <option key={t} value={t} className="bg-slate-800">{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Event Count */}
                    <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                      <p className="text-sm text-slate-400 mb-2">Events Found</p>
                      <p className="text-3xl font-bold text-cyan-400">{timelineEvents.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Vertical Timeline */}
              <div className="lg:col-span-3">
                <div className="mb-8 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Upcoming Events</h2>
                  <p className="text-slate-600">Scroll down to see all scheduled events</p>
                </div>

                {timelineEvents.length === 0 ? (
                  <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl p-16 border border-slate-700 text-center shadow-xl">
                    <div className="text-slate-600 mb-6">
                      <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-200 mb-2">No events found</h3>
                    <p className="text-slate-400">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/60 via-cyan-500/60 to-cyan-400/60"></div>

                    {/* Timeline Events */}
                    <div className="space-y-8">
                      {timelineEvents.map((event, index) => {
                        const eventDate = event.scheduled_at ?? event.timestamp;
                        const month = eventDate.toLocaleDateString("en-US", { month: 'short' });

                        return (
                          <div key={event.id} className="relative pl-16">
                            {/* Timeline Dot with Month */}
                            <div className="absolute left-0 flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-full border-4 border-slate-700 shadow-xl flex items-center justify-center transition-all ${event.isNew
                                  ? 'bg-cyan-400 ring-4 ring-cyan-400/40 animate-pulse shadow-cyan-400/50'
                                  : 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-500/30'
                                }`}>
                                <Clock className="w-5 h-5 text-slate-900" />
                              </div>
                              <div className="mt-2 text-center">
                                <p className="text-xs font-bold text-cyan-600 uppercase">{month}</p>
                              </div>
                            </div>


                            {/* Event Card */}
                            <div className={`bg-[#0f1729] backdrop-blur-sm rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 ${event.isNew
                                ? 'border-cyan-400 shadow-cyan-400/40 ring-4 ring-cyan-400/20'
                                : 'border-slate-700 hover:border-cyan-500/50'
                              }`}>
                              {/* Card Header */}
                              <div className="p-6 pb-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                                        {event.topic}
                                      </span>
                                      {event.isNew && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full animate-pulse">
                                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                                          LIVE
                                        </span>
                                      )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                      {event.message}
                                    </h3>
                                  </div>
                                  {/* Larger Date Badge */}
                                  <div className="text-right bg-cyan-400/20 border border-cyan-400/30 rounded-xl px-4 py-3">
                                    <p className="text-2xl font-bold text-white">
                                      {eventDate.toLocaleDateString("en-US", { day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-slate-200 uppercase font-semibold mt-1">
                                      {eventDate.toLocaleDateString("en-US", { month: 'short' })}
                                    </p>
                                  </div>
                                </div>

                                {/* Event Details - Highlighted Time */}
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2 bg-cyan-400/20 px-3 py-2 rounded-lg border border-cyan-400/30">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span className="font-bold text-white">
                                      {eventDate.toLocaleTimeString("en-IN", {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  {event.scheduled_at && (
                                    <span className="px-3 py-2 bg-cyan-400/20 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-400/30">
                                      Scheduled Event
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
