
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

const students = [
    { id: 1, name: "John Smith", status: "Present" },
    { id: 2, name: "Sarah Johnson", status: "Absent" },
    { id: 3, name: "Michael Brown", status: "Present" },
    { id: 4, name: "Emma Davis", status: "Late" },
    { id: 5, name: "James Wilson", status: "Present" },
];

const classes = ["Mathematics 2B", "Physics 3A", "Chemistry 3B"];

export default function TeacherAttendancePage() {
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [date, setDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Attendance</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Class Attendance</CardTitle>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((className) => (
                                        <SelectItem key={className} value={className}>
                                            {className}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="w-full h-10" />
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                {student.name}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${student.status === 'Present' ? 'bg-green-100 text-green-800' : 
                                                      student.status === 'Absent' ? 'bg-red-100 text-red-800' : 
                                                      'bg-yellow-100 text-yellow-800'}`
                                                }>
                                                    {student.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-[350px] w-full rounded-md" />
                        ) : (
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => date && setDate(date)}
                                className="rounded-md border"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
