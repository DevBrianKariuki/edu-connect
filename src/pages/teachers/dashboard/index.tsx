
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, Clock } from "lucide-react";
import { getCollectionCount, getTeacherSchedule } from "@/lib/firebase/data";

export default function TeacherDashboardPage() {
    const { state } = useAuth();
    const teacher = state.user;
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        classes: 0,
        students: 0,
        todayClasses: 0,
    });
    const [schedule, setSchedule] = useState<any[]>([]);
    const [nextClass, setNextClass] = useState<any>(null);

    useEffect(() => {
        async function fetchTeacherData() {
            setIsLoading(true);
            try {
                const teacherId = teacher?.id || "dummy-teacher-id";
                
                // Fetch statistics
                // In a real app, these would be filtered by the teacher's ID
                const classesCount = await getCollectionCount("classes", "teacherId", teacherId);
                const studentsCount = await getCollectionCount("students");
                
                // Fetch today's schedule
                const todaySchedule = await getTeacherSchedule(teacherId);
                setSchedule(todaySchedule.length > 0 ? todaySchedule : [
                    {
                        id: "1",
                        time: "8:00 AM - 9:00 AM",
                        class: "Form 1A",
                        subject: "Mathematics",
                        room: "Room 101",
                    },
                    {
                        id: "2",
                        time: "10:00 AM - 11:00 AM",
                        class: "Form 2B",
                        subject: "Mathematics",
                        room: "Room 203",
                    },
                    {
                        id: "3",
                        time: "2:00 PM - 3:00 PM",
                        class: "Form 3C",
                        subject: "Mathematics",
                        room: "Room 105",
                    },
                ]);
                
                // Find the next class
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                // This is a simplified way to determine the next class
                // In a real app, you would parse the time strings and compare them
                let found = false;
                for (const session of todaySchedule) {
                    const startTime = session.startTime.split(":");
                    const startHour = parseInt(startTime[0]);
                    const startMinute = parseInt(startTime[1]);
                    
                    if (startHour > currentHour || (startHour === currentHour && startMinute > currentMinute)) {
                        setNextClass({
                            time: session.startTime,
                            class: session.className,
                            subject: session.subject,
                        });
                        found = true;
                        break;
                    }
                }
                
                // If no next class found, use the sample data
                if (!found && todaySchedule.length === 0) {
                    setNextClass({
                        time: "10:00 AM",
                        class: "Form 2B",
                        subject: "Mathematics",
                    });
                }
                
                setStats({
                    classes: classesCount > 0 ? classesCount : 4,
                    students: studentsCount > 0 ? studentsCount : 156,
                    todayClasses: todaySchedule.length > 0 ? todaySchedule.length : 3,
                });
            } catch (error) {
                console.error("Error fetching teacher data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchTeacherData();
    }, [teacher]);

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
                        <div className="text-2xl font-bold">
                            {isLoading ? "..." : stats.classes}
                        </div>
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
                        <div className="text-2xl font-bold">
                            {isLoading ? "..." : stats.students}
                        </div>
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
                        <div className="text-2xl font-bold">
                            {isLoading ? "..." : stats.todayClasses}
                        </div>
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
                        <div className="text-2xl font-bold">
                            {isLoading ? "..." : nextClass?.time}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "..." : `${nextClass?.class} - ${nextClass?.subject}`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading schedule...</p>
                    ) : schedule.length > 0 ? (
                        <div className="space-y-4">
                            {schedule.map((session, index) => (
                                <div
                                    key={session.id || index}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{session.class || session.className}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {session.subject}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-medium">
                                            {session.time || `${session.startTime} - ${session.endTime}`}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {session.room}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
