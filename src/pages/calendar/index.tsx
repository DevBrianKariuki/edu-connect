import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Event {
  id: string;
  title: string;
  date: Date;
  type: string;
  description: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Parent-Teacher Meeting",
      date: new Date(2024, 3, 15),
      type: "Meeting",
      description: "Discuss student progress with parents",
    },
    {
      id: "2",
      title: "Sports Day",
      date: new Date(2024, 3, 20),
      type: "Event",
      description: "Annual school sports day",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "",
    description: "",
  });

  const handleAddEvent = () => {
    if (date && newEvent.title && newEvent.type) {
      const event: Event = {
        id: Math.random().toString(),
        date: date,
        ...newEvent,
      };
      setEvents([...events, event]);
      setNewEvent({ title: "", type: "", description: "" });
    }
  };

  const selectedDateEvents = events.filter(
    (event) => event.date.toDateString() === date?.toDateString()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-inter">School Calendar</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus size={20} className="mr-2" />
                Add Event
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Enter event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Input
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, type: e.target.value })
                    }
                    placeholder="Enter event type"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Enter event description"
                  />
                </div>
                <Button onClick={handleAddEvent} className="w-full">
                  Add Event
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold font-inter">
          Events for {date?.toLocaleDateString()}
        </h2>
        <div className="space-y-4">
          {selectedDateEvents.length === 0 ? (
            <p className="text-muted-foreground">No events for this date</p>
          ) : (
            selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-4 rounded-lg shadow space-y-2"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Type: {event.type}</p>
                  <p>{event.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;