import Icon from "../../icons/Icon";

interface Event {
  id: string;
  topic: string;
  message: string;
  scheduled_at: string;
}

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export default function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  return (
    <table className="w-full">
      <thead className="bg-slate-900/50 sticky top-0">
        <tr>
          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Topic</th>
          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Message</th>
          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Scheduled At</th>
          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-700">
        {events.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
              No events found
            </td>
          </tr>
        ) : (
          events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 text-white font-medium">{event.topic}</td>
              <td className="px-6 py-4 text-white">{event.message}</td>
              <td className="px-6 py-4 text-white">
                {new Date(event.scheduled_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(event)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
