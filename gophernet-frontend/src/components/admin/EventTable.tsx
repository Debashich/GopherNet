import Icon from "../../icons/Icon";

interface AdminEvent {
  id: string;
  topic: string;
  message: string;
  scheduled_at: string;
  status: string;
}

interface EventTableProps {
  events: AdminEvent[];
  onEdit: (event: AdminEvent) => void;
  onDelete: (id: string) => void;
}

export default function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#1e293b] rounded-lg shadow-xl overflow-hidden border border-[#334155]">
      <table className="min-w-full divide-y divide-[#334155]">
        <thead className="bg-[#0f172a]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Topic
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Scheduled At
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155]">
          {events.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Icon name="empty" className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">No events yet. Create your first event!</p>
                </div>
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id} className="hover:bg-[#334155]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-teal-400">
                    {event.topic}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300 line-clamp-2">
                    {event.message}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(event.scheduled_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    event.status === 'published' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : event.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {event.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(event)}
                    className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 mr-4 font-semibold"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
