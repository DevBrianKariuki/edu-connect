
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

const grades = {
    "Mathematics 2B": [
        { id: 1, name: "John Smith", midterm: 85, final: 88, project: 90, overall: "A" },
        { id: 2, name: "Sarah Johnson", midterm: 78, final: 82, project: 85, overall: "B+" },
        { id: 3, name: "Michael Brown", midterm: 92, final: 95, project: 88, overall: "A+" },
        { id: 4, name: "Emma Davis", midterm: 88, final: 85, project: 92, overall: "A" },
        { id: 5, name: "James Wilson", midterm: 75, final: 80, project: 78, overall: "B" },
    ],
    "Physics 3A": [
        { id: 1, name: "Alice Thompson", midterm: 90, final: 92, project: 88, overall: "A" },
        { id: 2, name: "David Lee", midterm: 85, final: 88, project: 90, overall: "A" },
        { id: 3, name: "Emily White", midterm: 78, final: 82, project: 80, overall: "B+" },
    ],
    "Chemistry 3B": [
        { id: 1, name: "Ryan Martinez", midterm: 88, final: 85, project: 92, overall: "A" },
        { id: 2, name: "Sofia Garcia", midterm: 92, final: 95, project: 90, overall: "A+" },
        { id: 3, name: "William Taylor", midterm: 75, final: 78, project: 80, overall: "B" },
    ],
};

export default function TeacherGradesPage() {
    const [selectedClass, setSelectedClass] = useState("Mathematics 2B");

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Student Grades</h1>
                <div className="w-[200px]">
                    <Select
                        value={selectedClass}
                        onValueChange={setSelectedClass}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(grades).map((className) => (
                                <SelectItem key={className} value={className}>
                                    {className}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{selectedClass} - Grade Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-right">Midterm</TableHead>
                                <TableHead className="text-right">Final</TableHead>
                                <TableHead className="text-right">Project</TableHead>
                                <TableHead className="text-right">Overall Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {grades[selectedClass as keyof typeof grades].map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        {student.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {student.midterm}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {student.final}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {student.project}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {student.overall}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
