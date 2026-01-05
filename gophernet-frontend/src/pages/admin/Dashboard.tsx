import { useState, useEffect } from "react";
import Icon from "../../icons/Icon";

interface Event {
  id: string;
  topic: string;
  message: string;
  scheduled_at: string;
  created_at?: string;
}

const API_BASE_URL = "http://localhost:3000";

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        let eventsList = [];
        
        if (Array.isArray(data)) {
          eventsList = data;
        } else if (data && Array.isArray(data.events)) {
          eventsList = data.events;
        } else if (data && data.events === null) {
          eventsList = [];
        }
        
        setEvents(eventsList);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalEvents = events.length;
  
  const scheduledEvents = events.filter(event => {
    const scheduledDate = new Date(event.scheduled_at);
    return scheduledDate > new Date();
  }).length;

  const publishedToday = events.filter(event => {
    const eventDate = new Date(event.created_at || event.scheduled_at);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length;

  // Placeholder for active users - you'll need a users endpoint
  const activeUsers = 0; // Replace with actual API call when available

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-600 mt-1">Overview of your event management system</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-cyan-500"></div>
            <p className="text-slate-600 mt-3 font-medium">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Events */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-sm font-medium">Total Events</h3>
              <Icon name="calendar" className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{totalEvents}</p>
            <p className="text-slate-400 text-xs mt-2">All time events</p>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-sm font-medium">Active Users</h3>
              <Icon name="users" className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{activeUsers}</p>
            <p className="text-slate-400 text-xs mt-2">Connected users</p>
          </div>

          {/* Scheduled Events */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-sm font-medium">Scheduled Events</h3>
              <Icon name="clock" className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{scheduledEvents}</p>
            <p className="text-slate-400 text-xs mt-2">Upcoming events</p>
          </div>

          {/* Published Today */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-sm font-medium">Published Today</h3>
              <Icon name="plus" className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{publishedToday}</p>
            <p className="text-slate-400 text-xs mt-2">Events created today</p>
          </div>
        </div>
      )}

      {/* Optional: Recent Events Section */}
      {!isLoading && events.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Events</h3>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/20 shadow-lg">
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{event.topic}</p>
                    <p className="text-slate-400 text-sm">{event.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 text-sm">
                      {new Date(event.scheduled_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
