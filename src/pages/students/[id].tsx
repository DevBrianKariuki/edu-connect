import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDetails() {
	const { id } = useParams();

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Student Details</h1>
				<div className="space-x-2">
					<Button variant="outline">Edit</Button>
					<Button variant="destructive">Delete</Button>
				</div>
			</div>

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="academic">Academic</TabsTrigger>
					<TabsTrigger value="attendance">Attendance</TabsTrigger>
					<TabsTrigger value="discipline">Discipline</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Personal Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Name:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Admission No:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Date of Birth:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Gender:
									</span>
									<span>Loading...</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Guardian Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Guardian Name:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Relationship:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Contact:
									</span>
									<span>Loading...</span>
								</div>
								<div className="grid grid-cols-2 gap-1">
									<span className="text-muted-foreground">
										Email:
									</span>
									<span>Loading...</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="academic">
					<Card>
						<CardHeader>
							<CardTitle>Academic Performance</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								No academic records found.
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="attendance">
					<Card>
						<CardHeader>
							<CardTitle>Attendance Records</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								No attendance records found.
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="discipline">
					<Card>
						<CardHeader>
							<CardTitle>Discipline Records</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								No discipline records found.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
