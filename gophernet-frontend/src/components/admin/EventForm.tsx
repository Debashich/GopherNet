import { useState } from "react";

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: EventFormData;
}

export interface EventFormData {
  topic: string;
  message: string;
  scheduled_at: string;
}

export default function EventForm({ onClose, onSubmit, initialData }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      topic: "",
      message: "",
      scheduled_at: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-cyan-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-cyan-200">
        <h3 className="text-2xl font-bold text-gray-900">
          {initialData ? "Edit Event" : "Create New Event"}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Topic Input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Topic
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-gray-400"
            placeholder="e.g., Movie, Sports, Tech"
            required
          />
        </div>

        {/* Message Textarea */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-gray-400 resize-none"
            rows={5}
            placeholder="Event description..."
            required
          />
        </div>

        {/* Scheduled At Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Scheduled At
          </label>
          <input
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border border-gray-300 hover:bg-gray-200 hover:border-gray-400 active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="relative overflow-hidden flex-1 px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 hover:scale-105 active:scale-95 active:brightness-90 transition-all duration-200 shadow-lg shadow-cyan-500/30"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
