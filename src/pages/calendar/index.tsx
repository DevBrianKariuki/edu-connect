
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarSkeletons, UpcomingEventsSkeleton } from "@/components/calendar/CalendarSkeletons";
import { EventForm } from "@/components/calendar/EventForm";
import { getEvents, getUpcomingEvents, Event } from "@/lib/firebase/events";
import { useToast } from "@/hooks/use-toast";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const upcomingEvents = await getUpcomingEvents();
      setEvents(upcomingEvents);
      
      // Fetch all events to highlight dates on calendar
      const allEventsData = await getEvents();
      setAllEvents(allEventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">School Calendar</h1>
        <Button onClick={() => setShowAddEventForm(true)}>Add Event</Button>
      </div>

      {isLoading ? (
        <CalendarSkeletons />
      ) : (
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  eventDay: allEvents.map(event => new Date(event.date))
                }}
                modifiersStyles={{
                  eventDay: {
                    backgroundColor: "#F2FCE2",
                    borderRadius: "0"
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <UpcomingEventsSkeleton />
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(event.date, "MMMM d, yyyy")}
                      </div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Location: {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <EventForm 
        open={showAddEventForm} 
        onOpenChange={setShowAddEventForm} 
        onSuccess={fetchEvents}
      />
    </div>
  );
}
