
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Clock } from "lucide-react";

const subjects = [
    {
        id: 1,
        name: "Mathematics",
        grade: "Form 2",
        students: 32,
        nextClass: "Monday, 10:00 AM",
        topics: ["Algebra", "Geometry", "Trigonometry"],
    },
    {
        id: 2,
        name: "Physics",
        grade: "Form 3",
        students: 28,
        nextClass: "Tuesday, 11:00 AM",
        topics: ["Mechanics", "Electricity", "Optics"],
    },
    {
        id: 3,
        name: "Chemistry",
        grade: "Form 3",
        students: 30,
        nextClass: "Wednesday, 9:00 AM",
        topics: ["Organic Chemistry", "Periodic Table", "Chemical Reactions"],
    },
];

export default function TeacherSubjectsPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">My Subjects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription>{subject.grade}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{subject.students} Students</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Next Class: {subject.nextClass}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Current Topics:</span>
                                </div>
                                <ul className="list-disc list-inside text-sm text-muted-foreground pl-5">
                                    {subject.topics.map((topic, index) => (
                                        <li key={index}>{topic}</li>
                                    ))}
                                </ul>
                            </div>
                            <Button className="w-full mt-4">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
