import { useEffect, useState } from "react";

export interface Event {
  id: number;
  topic: string;
  message: string;
  timestamp: string;
}

export function useEvents(topic: string) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const lastID = events.length ? events[events.length - 1].id : 0;

    const ws = new WebSocket(
      `ws://localhost:3000/subscribe?topic=${topic}&offset=${lastID}`
    );

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);
      setEvents((prev) => [...prev, event]);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    return () => ws.close();
  }, [topic]);

  return events;
}
