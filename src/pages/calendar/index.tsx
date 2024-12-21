import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
	EventFormDialog,
	EventFormData,
} from "@/components/calendar/EventFormDialog";
import { EventDetailsDialog } from "@/components/calendar/EventDetailsDialog";
import { useToast } from "@/components/ui/use-toast";

interface Event {
	id: string;
	title: string;
	date: Date;
	type: "academic" | "holiday" | "exam" | "other";
	description?: string;
}

const mockEvents: Event[] = [
	{
		id: "1",
		title: "First Term Begins",
		date: new Date(2024, 0, 15),
		type: "academic",
		description: "Start of the first academic term for 2024",
	},
	{
		id: "2",
		title: "Mid-Term Break",
		date: new Date(2024, 1, 20),
		type: "holiday",
		description: "One week break for all students",
	},
	{
		id: "3",
		title: "End Term Exams",
		date: new Date(2024, 3, 1),
		type: "exam",
		description: "Final examinations for the first term",
	},
	{
		id: "4",
		title: "Sports Day",
		date: new Date(2024, 2, 15),
		type: "other",
		description: "Annual school sports day event",
	},
	{
		id: "5",
		title: "Science Fair",
		date: new Date(2024, 4, 10),
		type: "academic",
		description: "Annual Science and Technology Exhibition",
	},
	{
		id: "6",
		title: "Parent-Teacher Meeting",
		date: new Date(2024, 3, 25),
		type: "academic",
		description: "Term 1 Parent-Teacher Conference",
	},
];

const CalendarPage = () => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [showEventDialog, setShowEventDialog] = useState(false);
	const [showEventDetails, setShowEventDetails] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [events, setEvents] = useState(mockEvents);
	const { toast } = useToast();

	const handleEventClick = (event: Event) => {
		setSelectedEvent(event);
		setShowEventDetails(true);
	};

	const getEventsForDate = (date: Date | undefined) => {
		if (!date) return [];
		return events.filter(
			(event) => event.date.toDateString() === date.toDateString()
		);
	};

	const handleAddEvent = (formData: EventFormData) => {
		const newEvent: Event = {
			id: (events.length + 1).toString(),
			title: formData.title,
			date: new Date(formData.date),
			type: formData.type as "academic" | "holiday" | "exam" | "other",
			description: formData.description,
		};

		setEvents([...events, newEvent]);
		setShowEventDialog(false);
		toast({
			title: "Event Added",
			description:
				"The event has been successfully added to the calendar.",
		});
	};

	const getEventTypeColor = (type: string) => {
		switch (type) {
			case "academic":
				return "bg-blue-100 text-blue-800";
			case "holiday":
				return "bg-green-100 text-green-800";
			case "exam":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const renderEventCard = (event: Event) => (
		<div
			key={event.id}
			className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-colors"
			onClick={() => handleEventClick(event)}>
			<div className="flex items-center justify-between">
				<div>
					<h4 className="font-medium">{event.title}</h4>
					<p className="text-sm text-gray-500">
						{event.date.toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
						event.type
					)}`}>
					{event.type.charAt(0).toUpperCase() + event.type.slice(1)}
				</span>
			</div>
		</div>
	);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">School Calendar</h1>
				<Button
					onClick={() => setShowEventDialog(true)}
					className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
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
										{selectedDate.toLocaleDateString(
											"en-US",
											{
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											}
										)}
									</h3>
									<div className="space-y-4">
										{getEventsForDate(selectedDate).map(
											(event) => renderEventCard(event)
										)}
										{getEventsForDate(selectedDate)
											.length === 0 && (
											<p className="text-gray-500 text-center py-4">
												No events scheduled for this
												date
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
								{events
									.filter((event) => {
										const today = new Date();
										today.setHours(0, 0, 0, 0);
										const eventDate = new Date(event.date);
										eventDate.setHours(0, 0, 0, 0);
										return eventDate >= today;
									})
									.sort(
										(a, b) =>
											a.date.getTime() - b.date.getTime()
									)
									.slice(0, 3)
									.map((event) => renderEventCard(event))}
								{events.filter((event) => {
									const today = new Date();
									today.setHours(0, 0, 0, 0);
									const eventDate = new Date(event.date);
									eventDate.setHours(0, 0, 0, 0);
									return eventDate >= today;
								}).length === 0 && (
									<p className="text-gray-500 text-center py-4">
										No upcoming events
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<EventFormDialog
				open={showEventDialog}
				onOpenChange={setShowEventDialog}
				onSubmit={handleAddEvent}
			/>

			<EventDetailsDialog
				event={selectedEvent}
				open={showEventDetails}
				onOpenChange={setShowEventDetails}
			/>
		</div>
	);
};

export default CalendarPage;
