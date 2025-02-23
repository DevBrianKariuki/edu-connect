
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, Clock } from "lucide-react";

export default function TeacherDashboardPage() {
    const { state } = useAuth();
    const teacher = state.user;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {teacher?.name}</h1>
                    <p className="text-muted-foreground">
                        Staff ID: {teacher?.staffId}
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = "/teacher/schedule"}>
                    View Schedule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Classes
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">
                            Active classes this term
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            Across all classes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Classes
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled for today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Next Class
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10:00 AM</div>
                        <p className="text-xs text-muted-foreground">
                            Form 2B - Mathematics
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            {
                                time: "8:00 AM - 9:00 AM",
                                class: "Form 1A",
                                subject: "Mathematics",
                                room: "Room 101",
                            },
                            {
                                time: "10:00 AM - 11:00 AM",
                                class: "Form 2B",
                                subject: "Mathematics",
                                room: "Room 203",
                            },
                            {
                                time: "2:00 PM - 3:00 PM",
                                class: "Form 3C",
                                subject: "Mathematics",
                                room: "Room 105",
                            },
                        ].map((session, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium">{session.class}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {session.subject}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm font-medium">
                                        {session.time}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {session.room}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
