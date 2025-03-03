
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/AuthContext";
import InfoStrip from "@/components/dashboard/InfoStrip";
import { BookOpen, Calendar, MessageSquare, FileText } from "lucide-react";
import { getUpcomingEvents, getStudentProgress } from "@/lib/firebase/data";
import { format } from "date-fns";

export default function ParentDashboardPage() {
	const { state } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState<any[]>([]);
	const [progress, setProgress] = useState<any[]>([]);
	const [stats, setStats] = useState({
		attendance: 95,
		assignments: 2,
		eventsCount: 0,
		messages: 1,
	});

	useEffect(() => {
		async function fetchDashboardData() {
			setIsLoading(true);
			try {
				// For a real app, you would get the student ID from the parent's profile
				const studentId = "dummy-student-id"; // Placeholder
				
				// Fetch upcoming events
				const upcomingEvents = await getUpcomingEvents(3);
				setEvents(upcomingEvents);
				setStats(prev => ({ ...prev, eventsCount: upcomingEvents.length }));
				
				// Fetch student progress
				const academicProgress = await getStudentProgress(studentId);
				setProgress(academicProgress.length > 0 ? academicProgress : [
					{ subject: "Mathematics", score: 85 },
					{ subject: "English", score: 92 },
					{ subject: "Science", score: 88 },
					{ subject: "Social Studies", score: 90 },
				]);
				
				// In a real app, you would fetch these values from Firebase
				// For now, we'll use the mock data for demonstration
			} catch (error) {
				console.error("Error fetching parent dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		
		fetchDashboardData();
	}, []);

	return (
		<div>
			<InfoStrip />
			<div className="container mx-auto p-6">
				<h1 className="text-3xl font-bold mb-6">
					Welcome, {state.user?.name}
				</h1>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Attendance Rate
							</CardTitle>
							<BookOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.attendance}%</div>
							<p className="text-xs text-muted-foreground">
								Last 30 days
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Assignments Due
							</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.assignments}</div>
							<p className="text-xs text-muted-foreground">
								This week
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Upcoming Events
							</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? "..." : stats.eventsCount}
							</div>
							<p className="text-xs text-muted-foreground">
								Next 7 days
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Unread Messages
							</CardTitle>
							<MessageSquare className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.messages}</div>
							<p className="text-xs text-muted-foreground">
								From school
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Academic Progress</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<p className="text-sm text-muted-foreground">Loading progress...</p>
							) : (
								<div className="space-y-4">
									{progress.map((subject, index) => (
										<div key={index} className="flex justify-between items-center">
											<span>{subject.subject}</span>
											<span className="font-medium">{subject.score}%</span>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<p className="text-sm text-muted-foreground">Loading events...</p>
							) : events.length > 0 ? (
								<div className="space-y-4">
									{events.map((event) => (
										<div key={event.id}>
											<h3 className="font-medium">{event.title}</h3>
											<p className="text-sm text-muted-foreground">
												{format(event.date, "MMMM d, yyyy")}
												{event.time ? ` - ${event.time}` : ""}
											</p>
										</div>
									))}
								</div>
							) : (
								<div className="space-y-4">
									<div>
										<h3 className="font-medium">
											Parent-Teacher Meeting
										</h3>
										<p className="text-sm text-muted-foreground">
											March 25, 2024 - 2:00 PM
										</p>
									</div>
									<div>
										<h3 className="font-medium">
											Sports Day
										</h3>
										<p className="text-sm text-muted-foreground">
											March 28, 2024 - All Day
										</p>
									</div>
									<div>
										<h3 className="font-medium">
											End of Term Exams
										</h3>
										<p className="text-sm text-muted-foreground">
											April 1-5, 2024
										</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
