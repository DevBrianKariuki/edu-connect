
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
import { Book, Clock } from "lucide-react";

// Dummy data for development
const subjects = [
    { id: 1, name: "Mathematics", teacher: "Mr. John Smith", grade: "Grade 8" },
    { id: 2, name: "English", teacher: "Mrs. Jane Doe", grade: "Grade 8" },
    { id: 3, name: "Science", teacher: "Dr. Bob Wilson", grade: "Grade 8" },
    { id: 4, name: "History", teacher: "Ms. Sarah Brown", grade: "Grade 8" },
    { id: 5, name: "Geography", teacher: "Mr. Mike Johnson", grade: "Grade 8" },
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
    ],
};

const TimetablePage = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Class Timetable</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Book className="h-5 w-5" />
                        Enrolled Subjects
                    </CardTitle>
                    <CardDescription>List of subjects for this academic year</CardDescription>
                </CardHeader>
                <CardContent>
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
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell>{subject.teacher}</TableCell>
                                    <TableCell>{subject.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Class schedule for the week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {Object.entries(timetable).map(([day, schedule]) => (
                            <Card key={day}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{day}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {schedule.map((slot, index) => (
                                        <div key={index} className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {slot.time}
                                            </p>
                                            <p className="font-medium">{slot.subject}</p>
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
