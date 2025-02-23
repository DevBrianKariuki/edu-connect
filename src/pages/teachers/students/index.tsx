
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const students = [
    {
        id: 1,
        name: "John Smith",
        grade: "Form 2",
        class: "2B",
        attendance: "95%",
        performance: "Excellent",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        grade: "Form 2",
        class: "2B",
        attendance: "92%",
        performance: "Good",
    },
    {
        id: 3,
        name: "Michael Brown",
        grade: "Form 2",
        class: "2B",
        attendance: "88%",
        performance: "Average",
    },
    {
        id: 4,
        name: "Emma Davis",
        grade: "Form 2",
        class: "2B",
        attendance: "98%",
        performance: "Excellent",
    },
    {
        id: 5,
        name: "James Wilson",
        grade: "Form 2",
        class: "2B",
        attendance: "85%",
        performance: "Good",
    },
];

export default function TeacherStudentsPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Students</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-8"
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Class 2B Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Performance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        {student.name}
                                    </TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.attendance}</TableCell>
                                    <TableCell>{student.performance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
