import { useState, useEffect } from "react";
import EventTable from "../../components/admin/EventTable";
import EventForm, { EventFormData } from "../../components/admin/EventForm";
import Icon from "../../icons/Icon";


interface AdminEvent {
  id: string;
  topic: string;
  message: string;
  scheduled_at: string;
}


const API_BASE_URL = "http://localhost:3000";


export default function EventManager() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


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


  const handleCreateEvent = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      const scheduledAt = new Date(data.scheduled_at).toISOString();


      const response = await fetch(`${API_BASE_URL}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          topic: data.topic,
          message: data.message,
          scheduled_at: scheduledAt,
        }),
      });


      if (response.ok) {
        setShowForm(false);
        await fetchEvents();
      }
    } catch (error) {
      console.error("Create error:", error);
      setShowForm(false);
      setTimeout(() => fetchEvents(), 500);
    } finally {
      setIsLoading(false);
    }
  };


  const handleEditEvent = (event: AdminEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };


  const handleUpdateEvent = async (data: EventFormData) => {
    if (!editingEvent) return;


    const scheduledAt = new Date(data.scheduled_at).toISOString();


    try {
      setIsLoading(true);


      const response = await fetch(`${API_BASE_URL}/events/${editingEvent.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          topic: data.topic,
          message: data.message,
          scheduled_at: scheduledAt,
        }),
      });


      if (response.ok) {
        setShowForm(false);
        setEditingEvent(null);
        await fetchEvents();
      } else {
        setEvents(events.map(e => 
          e.id === editingEvent.id 
            ? { ...e, topic: data.topic, message: data.message, scheduled_at: scheduledAt }
            : e
        ));
        setShowForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      setShowForm(false);
      setEditingEvent(null);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;


    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });


      await fetchEvents();
      
    } catch (error) {
      console.error("Delete error:", error);
      await fetchEvents();
    } finally {
      setIsLoading(false);
    }
  };


  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };


  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });


  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Event Manager</h2>
        <p className="text-slate-600 mt-1">Create, manage, and schedule live events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-cyan-500/20 shadow-lg">
          <p className="text-cyan-400 text-sm font-medium">Total Events</p>
          <p className="text-3xl font-bold text-white mt-2">{events.length}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-cyan-500/20 shadow-lg">
          <p className="text-cyan-400 text-sm font-medium">Filtered Results</p>
          <p className="text-3xl font-bold text-white mt-2">{filteredEvents.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 shadow-lg border border-cyan-500/20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search events by topic or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-white rounded-xl border border-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-slate-700 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowForm(true);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 
            bg-cyan-500
            text-white rounded-xl font-medium 
            active:scale-95 active:brightness-110
            transition-all duration-200
            disabled:opacity-80 disabled:cursor-not-allowed 
            whitespace-nowrap shadow-lg 
            hover:scale-105 "
          >
            <Icon name="plus" className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Table Container with Better Spacing */}
      <div className="flex-1 overflow-hidden mb-6">
        <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-cyan-500/20 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-cyan-500"></div>
                <p className="text-slate-300 mt-3 font-medium">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <EventTable
                events={filteredEvents}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <EventForm
            onClose={closeForm}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent ? {
              topic: editingEvent.topic,
              message: editingEvent.message,
              scheduled_at: new Date(editingEvent.scheduled_at)
                .toISOString()
                .slice(0, 16),
            } : undefined}
          />
        </div>
      )}
    </div>
  );
}
