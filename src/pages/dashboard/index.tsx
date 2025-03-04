
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/AuthContext";
import InfoStrip from "@/components/dashboard/InfoStrip";
import { getCollectionCount, getRecentActivities, getUpcomingEvents } from "@/lib/firebase/data";
import { format, formatDistanceToNow } from "date-fns";
import { 
  StatCardSkeleton, 
  ActivitiesSkeleton, 
  EventsSkeleton 
} from "@/components/dashboard/DashboardSkeletons";

export default function DashboardPage() {
	const { state } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		students: 0,
		teachers: 0,
		classes: 0,
		attendanceRate: 0,
	});
	const [activities, setActivities] = useState<any[]>([]);
	const [events, setEvents] = useState<any[]>([]);

	useEffect(() => {
		async function fetchDashboardData() {
			setIsLoading(true);
			try {
				// Fetch statistics
				const studentsCount = await getCollectionCount("students");
				const teachersCount = await getCollectionCount("staff", "role", "teacher");
				const classesCount = await getCollectionCount("classes");
				
				// Calculate attendance rate (this would require more complex logic in a real app)
				// For demo, we'll use a placeholder value
				const attendanceRate = 92;
				
				setStats({
					students: studentsCount,
					teachers: teachersCount,
					classes: classesCount,
					attendanceRate,
				});
				
				// Fetch recent activities
				const recentActivities = await getRecentActivities(5);
				setActivities(recentActivities);
				
				// Fetch upcoming events
				const upcomingEvents = await getUpcomingEvents(3);
				setEvents(upcomingEvents);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
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
								Total Students
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? <Skeleton className="h-8 w-16" /> : stats.students}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Teachers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? <Skeleton className="h-8 w-16" /> : stats.teachers}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Classes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? <Skeleton className="h-8 w-16" /> : stats.classes}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Attendance Rate
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? <Skeleton className="h-8 w-16" /> : `${stats.attendanceRate}%`}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Recent Activities</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<ActivitiesSkeleton />
							) : activities.length > 0 ? (
								<div className="space-y-4">
									{activities.map((activity) => (
										<div key={activity.id} className="flex justify-between items-start border-b pb-2 last:border-0">
											<div>
												<p className="font-medium">{activity.title}</p>
												<p className="text-sm text-muted-foreground">{activity.description}</p>
											</div>
											<p className="text-xs text-muted-foreground">
												{formatDistanceToNow(activity.timestamp, { addSuffix: true })}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">No recent activities</p>
							)}
						</CardContent>
					</Card>

					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<EventsSkeleton />
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
								<p className="text-sm text-muted-foreground">No upcoming events</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
