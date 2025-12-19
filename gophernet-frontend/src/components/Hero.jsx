export default function Hero({ event }) {
  if (!event) return null;

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            {event.topic}
            <br />
            <span className="text-cyan-700">
              Event Automation
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            {event.message}. GopherNet delivers distributed, real-time
            notifications with reliability and precision.
          </p>

          <div className="flex gap-4 pt-2">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-blue-700 text-white text-sm font-semibold rounded-md hover:opacity-90">
              Start Free Trial
            </button>
            <button className="px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900">
              View Demo
            </button>
          </div>

          <p className="text-xs font-mono text-slate-500">
            {new Date(event.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}
