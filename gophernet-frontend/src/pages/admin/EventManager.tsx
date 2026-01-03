import { useState, useEffect } from "react";
import EventTable from "../../components/admin/EventTable";
import EventForm, { EventFormData } from "../../components/admin/EventForm";

interface AdminEvent {
  id: string;
  topic: string;
  message: string;
  scheduled_at: string;
  status: string;
}

const API_BASE_URL = "http://localhost:3000";

export default function EventManager() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        
        // Handle empty response or empty array
        let eventsList = [];
        
        if (Array.isArray(data)) {
          eventsList = data;
        } else if (data && Array.isArray(data.events)) {
          eventsList = data.events;
        } else if (data && data.events === null) {
          eventsList = [];
        }
        
        setEvents(eventsList);
        console.log("Fetched events:", eventsList.length);
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
      } else {
        const result = await response.json();
        console.error("Create failed:", result);
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
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...e, topic: data.topic, message: data.message, scheduled_at: scheduledAt }
          : e
      ));
      setShowForm(false);
      setEditingEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("⚠️ Delete this event?")) return;

    try {
      setIsLoading(true);
      
      console.log(`Deleting event with ID: ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      console.log(`Delete response status: ${response.status}`);

      // Always refresh after delete attempt
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Event Manager</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Create Event
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-600">
          Loading...
        </div>
      )}

      <EventTable
        events={events}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {showForm && (
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
      )}
    </div>
  );
}
