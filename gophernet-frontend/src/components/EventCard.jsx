export default function EventCard({ event }) {
  return (
    <div className="w-72 bg-white rounded-lg border border-slate-200 hover:border-cyan-600 transition">
      <div className="p-4 space-y-3">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-cyan-800 bg-cyan-100 rounded">
          {event.topic}
        </span>

        <p className="text-sm text-slate-800 leading-snug">
          {event.message}
        </p>

        <p className="text-xs font-mono text-slate-500">
          {new Date(event.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
