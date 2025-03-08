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
import { Book, Clock, GraduationCap, User } from "lucide-react";

// Dummy data for development
const subjects = [
    { id: 1, name: "Mathematics", teacher: "Mr. John Smith", grade: "Grade 8" },
    { id: 2, name: "English", teacher: "Mrs. Jane Doe", grade: "Grade 8" },
    { id: 3, name: "Science", teacher: "Dr. Bob Wilson", grade: "Grade 8" },
    { id: 4, name: "History", teacher: "Ms. Sarah Brown", grade: "Grade 8" },
    { id: 5, name: "Geography", teacher: "Mr. Mike Johnson", grade: "Grade 8" },
    { id: 6, name: "Art", teacher: "Ms. Emily Clark", grade: "Grade 8" },
];

const timetable = {
    Monday: [
        { time: "8:00 AM - 9:00 AM", subject: "Mathematics" },
        { time: "9:00 AM - 10:00 AM", subject: "English" },
        { time: "10:30 AM - 11:30 AM", subject: "Science" },
        { time: "11:30 AM - 12:30 PM", subject: "History" },
    ],
    Tuesday: [
        { time: "8:00 AM - 9:00 AM", subject: "Geography" },
        { time: "9:00 AM - 10:00 AM", subject: "Mathematics" },
        { time: "10:30 AM - 11:30 AM", subject: "English" },
        { time: "11:30 AM - 12:30 PM", subject: "Science" },
    ],
    Wednesday: [
        { time: "8:00 AM - 9:00 AM", subject: "History" },
        { time: "9:00 AM - 10:00 AM", subject: "Geography" },
        { time: "10:30 AM - 11:30 AM", subject: "Mathematics" },
        { time: "11:30 AM - 12:30 PM", subject: "English" },
    ],
    Thursday: [
        { time: "8:00 AM - 9:00 AM", subject: "Science" },
        { time: "9:00 AM - 10:00 AM", subject: "History" },
        { time: "10:30 AM - 11:30 AM", subject: "Geography" },
        { time: "11:30 AM - 12:30 PM", subject: "Mathematics" },
    ],
    Friday: [
        { time: "8:00 AM - 9:00 AM", subject: "English" },
        { time: "9:00 AM - 10:00 AM", subject: "Science" },
        { time: "10:30 AM - 11:30 AM", subject: "History" },
        { time: "11:30 AM - 12:30 PM", subject: "Geography" },
        { time: "1:00 PM - 2:00 PM", subject: "Art" },
    ],
};

// Color mapping for subjects
const subjectColors: { [key: string]: string } = {
    Mathematics: "bg-blue-50 border-blue-200",
    English: "bg-green-50 border-green-200",
    Science: "bg-purple-50 border-purple-200",
    History: "bg-orange-50 border-orange-200",
    Geography: "bg-pink-50 border-pink-200",
    Art: "bg-yellow-50 border-yellow-200",
};

const TimetablePage = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Class Timetable</h1>
                    <p className="text-muted-foreground">View your weekly class schedule and subjects</p>
                </div>
            </div>

            <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Enrolled Subjects
                    </CardTitle>
                    <CardDescription>List of subjects for this academic year</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Book className="h-4 w-4 text-primary" />
                                                {subject.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {subject.teacher}
                                            </div>
                                        </TableCell>
                                        <TableCell>{subject.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Weekly Schedule</CardTitle>
                    <CardDescription>Your class schedule for the week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {Object.entries(timetable).map(([day, schedule]) => (
                            <Card key={day} className="border shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-primary/5 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold">{day}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-4">
                                    {schedule.map((slot, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border ${
                                                subjectColors[slot.subject]
                                            } transition-all hover:scale-[1.02]`}
                                        >
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {slot.time}
                                            </p>
                                            <p className="font-medium mt-1">{slot.subject}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TimetablePage;
