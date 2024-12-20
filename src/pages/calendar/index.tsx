import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'academic' | 'holiday' | 'exam' | 'other';
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "First Term Begins",
    date: new Date(2024, 0, 15),
    type: "academic"
  },
  {
    id: "2",
    title: "Mid-Term Break",
    date: new Date(2024, 1, 20),
    type: "holiday"
  },
  {
    id: "3",
    title: "End Term Exams",
    date: new Date(2024, 3, 1),
    type: "exam"
  }
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'holiday':
        return 'bg-green-100 text-green-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">School Calendar</h1>
        <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
          <Plus size={20} />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setSelectedDate(newDate);
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <>
                  <h3 className="font-medium mb-4">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate).map(event => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {getEventsForDate(selectedDate).length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No events scheduled for this date
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Select a date to view events
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents
                  .filter(event => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-500">
                            {event.date.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;