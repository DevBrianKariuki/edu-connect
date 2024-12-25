import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CalendarPage() {
	const [date, setDate] = useState<Date | undefined>(new Date());

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">School Calendar</h1>
				<Button>Add Event</Button>
			</div>

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
						/>
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Upcoming Events</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="border rounded-lg p-3">
								<div className="font-medium">
									End of Term Exams
								</div>
								<div className="text-sm text-muted-foreground">
									March 15, 2024
								</div>
							</div>
							<div className="border rounded-lg p-3">
								<div className="font-medium">
									Parents Meeting
								</div>
								<div className="text-sm text-muted-foreground">
									March 20, 2024
								</div>
							</div>
							<div className="border rounded-lg p-3">
								<div className="font-medium">Sports Day</div>
								<div className="text-sm text-muted-foreground">
									March 25, 2024
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
