
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
}

const TimetablePage = () => {
    const [timetable, setTimetable] = useState<TimeSlot[]>([]);
    const [isAddingSlot, setIsAddingSlot] = useState(false);

    const form = useForm({
        defaultValues: {
            startTime: "",
            endTime: "",
            subject: "",
            description: "",
        },
    });

    const addTimeSlot = (data: any) => {
        const newSlot: TimeSlot = {
            id: Date.now().toString(),
            startTime: data.startTime,
            endTime: data.endTime,
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
        };
        setTimetable([...timetable, newSlot]);
        setIsAddingSlot(false);
        form.reset();
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">School Timetable Management</h1>
                <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Time Slot
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Time Slot</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addTimeSlot)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Time Slot
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-background border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Monday</TableHead>
                            <TableHead>Tuesday</TableHead>
                            <TableHead>Wednesday</TableHead>
                            <TableHead>Thursday</TableHead>
                            <TableHead>Friday</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timetable.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell className="font-medium">
                                    {slot.startTime} - {slot.endTime}
                                </TableCell>
                                <TableCell>{slot.monday}</TableCell>
                                <TableCell>{slot.tuesday}</TableCell>
                                <TableCell>{slot.wednesday}</TableCell>
                                <TableCell>{slot.thursday}</TableCell>
                                <TableCell>{slot.friday}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TimetablePage;
