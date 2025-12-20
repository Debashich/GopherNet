import { useRef } from "react";
import EventCard from "./EventCard";

export default function EventSection({ title, events }) {
  const scrollRef = useRef(null);
  if (!events.length) return null;

  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          {title}
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2"
        >
          {events.slice(0, 4).map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
