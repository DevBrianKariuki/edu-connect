
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/AuthContext";
import InfoStrip from "@/components/dashboard/InfoStrip";
import { BookOpen, Calendar, MessageSquare, FileText } from "lucide-react";

export default function ParentDashboardPage() {
	const { state } = useAuth();

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
							<div className="text-2xl font-bold">95%</div>
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
							<div className="text-2xl font-bold">2</div>
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
							<div className="text-2xl font-bold">3</div>
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
							<div className="text-2xl font-bold">1</div>
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
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span>Mathematics</span>
									<span className="font-medium">85%</span>
								</div>
								<div className="flex justify-between items-center">
									<span>English</span>
									<span className="font-medium">92%</span>
								</div>
								<div className="flex justify-between items-center">
									<span>Science</span>
									<span className="font-medium">88%</span>
								</div>
								<div className="flex justify-between items-center">
									<span>Social Studies</span>
									<span className="font-medium">90%</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
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
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
