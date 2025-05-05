// contexts/EventContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "./UserContext";
import { api } from "../utils/api";

// 1. Types
export type Event = {
  _id: string;
  title: string;
  date: string;
  host: {
    _id: string;
    name: string;
  };
  attendees: {
    _id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type FilterState = {
  host: string;
  date: string;
};

type EventContextType = {
  events: Event[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  createEvent: (event: Omit<Event, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<void>;
  editEvent: (updatedEvent: Omit<Event,  'createdAt' | 'updatedAt' | '__v'>) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  getMyEvents: () => Event[];
  getOtherUsersEvents: () => Event[];
  filterEvents: () => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

// 3. Provider
export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<FilterState>({ host: "", date: "" });

  const { user } = useUser();

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/list');
        setEvents(response.data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const joinEvent = async (eventId: string) => {
    if (!user) return;
    try {
      const response = await api.post(`/events/${eventId}/attend`);
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? response.data.event : event
        )
      );
    } catch (error) {
      console.error("Failed to join event:", error);
    }
  };

  const createEvent = async (event: Omit<Event, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    try {
      const response = await api.post('/events/create', event);
      setEvents((prev) => [...prev, response.data.event]);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const editEvent = async (updatedEvent: Omit<Event, 'createdAt' | 'updatedAt' | '__v'>) => {
    try {
      const response = await api.put(`/events/${updatedEvent._id}`, updatedEvent);
      setEvents((prev) =>
        prev.map((event) => (event._id === updatedEvent._id ? response.data.event : event))
      );
    } catch (error) {
      console.error("Failed to edit event:", error);
    }
  };

  const getMyEvents = (): Event[] => {
    if (!user) return [];

    console.log(events);

    return events.filter((event) => 
      event.host._id === user.id
    );
  };

  const getOtherUsersEvents = (): Event[] => {
    if (!user) return [];
    
    return filterEvents().filter((event) => {
      if (!event.host || !event.host._id) {
        return false;
      }
      return event.host._id !== user.id;
    });
  };

  const filterEvents = (): Event[] => {
    if (filters.host && !filters.date) {
      return events.filter(event => 
        event.host.name.toLowerCase().includes(filters.host.toLowerCase())
      );
    }
    
    if (filters.date && !filters.host) {
      return events.filter(event => 
        event.date === filters.date
      );
    }

    if (filters.host && filters.date) {
      return events.filter(event =>
        event.host.name.toLowerCase().includes(filters.host.toLowerCase()) &&
        event.date === filters.date
      );
    }

    return events;
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filters,
        setFilters,
        createEvent,
        editEvent,
        joinEvent,
        getMyEvents,
        getOtherUsersEvents,
        filterEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// 4. Hook
export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
