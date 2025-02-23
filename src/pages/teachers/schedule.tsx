
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const timeSlots = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Sample schedule data
const scheduleData = {
    "Monday-8:00 AM - 9:00 AM": {
        class: "Form 1A",
        subject: "Mathematics",
        room: "Room 101",
    },
    "Tuesday-10:00 AM - 11:00 AM": {
        class: "Form 2B",
        subject: "Mathematics",
        room: "Room 203",
    },
    // Add more schedule entries as needed
};

export default function TeacherSchedulePage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Class Schedule</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage your teaching schedule
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[140px]">Time</TableHead>
                                    {days.map((day) => (
                                        <TableHead key={day}>{day}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timeSlots.map((time) => (
                                    <TableRow key={time}>
                                        <TableCell className="font-medium">
                                            {time}
                                        </TableCell>
                                        {days.map((day) => {
                                            const schedule =
                                                scheduleData[`${day}-${time}`];
                                            return (
                                                <TableCell
                                                    key={`${day}-${time}`}
                                                    className="min-h-[100px]"
                                                >
                                                    {schedule ? (
                                                        <div className="space-y-1">
                                                            <Badge variant="secondary">
                                                                {schedule.class}
                                                            </Badge>
                                                            <p className="text-sm font-medium">
                                                                {schedule.subject}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {schedule.room}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic">
                                                            Free
                                                        </p>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
