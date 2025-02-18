
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, UserCheck } from "lucide-react";
import { format } from "date-fns";

// Dummy data for development
const attendanceRecords = [
    {
        date: "2024-03-15",
        status: "present",
        timeIn: "07:45 AM",
        timeOut: "03:30 PM",
        notes: "",
    },
    {
        date: "2024-03-14",
        status: "absent",
        timeIn: "-",
        timeOut: "-",
        notes: "Sick leave - Parent notified",
    },
    {
        date: "2024-03-13",
        status: "present",
        timeIn: "07:50 AM",
        timeOut: "03:30 PM",
        notes: "",
    },
];

const AttendancePage = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Attendance Records</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Calendar
                        </CardTitle>
                        <CardDescription>
                            View attendance by date
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recent Records
                        </CardTitle>
                        <CardDescription>
                            Latest attendance records
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time In</TableHead>
                                    <TableHead>Time Out</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceRecords.map((record) => (
                                    <TableRow key={record.date}>
                                        <TableCell>
                                            {format(
                                                new Date(record.date),
                                                "MMM dd, yyyy"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    record.status === "present"
                                                        ? "success"
                                                        : "destructive"
                                                }
                                                className="capitalize">
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{record.timeIn}</TableCell>
                                        <TableCell>{record.timeOut}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {record.notes || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AttendancePage;
