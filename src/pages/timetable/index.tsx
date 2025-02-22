
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, FileDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// TypeScript interfaces
interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
}

interface TimetableEntry {
    classId: string;
    teacherId: string;
    subject: string;
    roomId: string;
    timeSlot: string;
}

interface TimetableConstraints {
    term: string;
    classes: string[];
    additionalNotes?: string;
}

// Sample data
const timeSlots: TimeSlot[] = [
    { id: "1", startTime: "8:00", endTime: "9:00" },
    { id: "2", startTime: "9:00", endTime: "10:00" },
    { id: "3", startTime: "10:00", endTime: "11:00" },
    { id: "4", startTime: "11:00", endTime: "12:00" },
    { id: "5", startTime: "13:00", endTime: "14:00" },
    { id: "6", startTime: "14:00", endTime: "15:00" },
    { id: "7", startTime: "15:00", endTime: "16:00" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const terms = ["Term 1", "Term 2", "Term 3"];
const classes = ["Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A", "Form 3B"];

const TimetablePage = () => {
    const [isConstraintsOpen, setIsConstraintsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [constraints, setConstraints] = useState<TimetableConstraints>({
        term: "",
        classes: [],
        additionalNotes: "",
    });
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    const handleGenerateTimetable = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simulated API call - replace with actual Firebase function call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sample response
            const sampleTimetable: TimetableEntry[] = [
                {
                    classId: "Form 1A",
                    teacherId: "T1",
                    subject: "Math",
                    roomId: "R1",
                    timeSlot: "Mon 8-9",
                },
                // Add more sample entries as needed
            ];
            
            setTimetable(sampleTimetable);
        } catch (err) {
            setError("Failed to generate timetable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        // Placeholder for PDF download functionality
        console.log("Downloading PDF...");
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#1E3A8A]">Timetable</h1>
                <Button
                    onClick={handleGenerateTimetable}
                    disabled={isLoading}
                    className="bg-[#10B981] hover:bg-[#059669]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Timetable"
                    )}
                </Button>
            </div>

            {/* Constraints Form */}
            <Collapsible
                open={isConstraintsOpen}
                onOpenChange={setIsConstraintsOpen}
                className="border rounded-lg p-4 bg-white"
            >
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold">Timetable Constraints</h2>
                    {isConstraintsOpen ? (
                        <Minus className="h-4 w-4" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Select Term
                            </label>
                            <Select
                                onValueChange={(value) =>
                                    setConstraints({ ...constraints, term: value })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {terms.map((term) => (
                                        <SelectItem key={term} value={term}>
                                            {term}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Additional Notes
                            </label>
                            <Textarea
                                placeholder="Enter any additional constraints or notes..."
                                value={constraints.additionalNotes}
                                onChange={(e) =>
                                    setConstraints({
                                        ...constraints,
                                        additionalNotes: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Error State */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Timetable Grid */}
            <div className="rounded-lg border bg-white overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Time</TableHead>
                            {days.map((day) => (
                                <TableHead key={day}>{day}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timeSlots.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell className="font-medium">
                                    {slot.startTime} - {slot.endTime}
                                </TableCell>
                                {days.map((day) => (
                                    <TableCell
                                        key={`${slot.id}-${day}`}
                                        className="hover:bg-[#EFF6FF] transition-colors"
                                    >
                                        <div className="text-sm text-gray-600">
                                            <em>Free</em>
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleDownloadPDF}
                    disabled={timetable.length === 0}
                    variant="outline"
                    className="bg-gray-600 text-white hover:bg-gray-700"
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download as PDF
                </Button>
            </div>
        </div>
    );
};

export default TimetablePage;
