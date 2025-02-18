
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { GraduationCap, BookOpen, Trophy, Target } from "lucide-react";

// Dummy data for development
const performanceData = [
    { month: "Jan", score: 85 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 92 },
    { month: "Apr", score: 88 },
    { month: "May", score: 95 },
];

const subjects = [
    { name: "Mathematics", grade: "A", score: 92, teacher: "Mr. Smith" },
    { name: "English", grade: "B+", score: 87, teacher: "Mrs. Johnson" },
    { name: "Science", grade: "A-", score: 89, teacher: "Dr. Brown" },
    { name: "History", grade: "A", score: 94, teacher: "Ms. Davis" },
    { name: "Physics", grade: "B", score: 85, teacher: "Mr. Wilson" },
];

const AcademicProgressPage = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Academic Progress</h1>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Average Grade
                                </p>
                                <p className="text-2xl font-bold">A-</p>
                            </div>
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Class Rank
                                </p>
                                <p className="text-2xl font-bold">5th</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Attendance
                                </p>
                                <p className="text-2xl font-bold">98%</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>
                        Monthly academic performance overview
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Subjects Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>
                        Detailed breakdown by subject
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Teacher</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.name}>
                                    <TableCell className="font-medium">
                                        {subject.name}
                                    </TableCell>
                                    <TableCell>{subject.grade}</TableCell>
                                    <TableCell>{subject.score}%</TableCell>
                                    <TableCell>{subject.teacher}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AcademicProgressPage;
