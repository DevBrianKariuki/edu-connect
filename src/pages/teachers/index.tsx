import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    UserPlus, 
    Mail, 
    Phone, 
    Edit, 
    Trash2, 
    Check, 
    X 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    classTeacher: string;
    status: "active" | "inactive";
    joinDate: string;
    qualification: string;
}

const sampleTeachers: Teacher[] = [
    {
        id: "1",
        name: "John Smith",
        email: "john.smith@school.com",
        phone: "+254 712 345 678",
        subject: "Mathematics",
        classTeacher: "Form 1A",
        status: "active",
        joinDate: "2023-01-15",
        qualification: "B.Ed Mathematics",
    },
    {
        id: "2",
        name: "Mary Johnson",
        email: "mary.johnson@school.com",
        phone: "+254 723 456 789",
        subject: "English",
        classTeacher: "Form 2B",
        status: "active",
        joinDate: "2022-09-01",
        qualification: "M.Ed English Literature",
    },
    {
        id: "3",
        name: "David Kimani",
        email: "david.kimani@school.com",
        phone: "+254 734 567 890",
        subject: "Physics",
        classTeacher: "Form 3A",
        status: "inactive",
        joinDate: "2023-03-20",
        qualification: "B.Sc Physics, PGDE",
    },
];

export default function TeachersPage() {
    const [teachers] = useState<Teacher[]>(sampleTeachers);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Teachers</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and oversee all teachers
                    </p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Teacher
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Total Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{teachers.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Active Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {teachers.filter(t => t.status === "active").length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Inactive Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                            {teachers.filter(t => t.status === "inactive").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Teachers List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Class Teacher</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-6 text-muted-foreground">
                                        No teachers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>
                                            <Link to={`/teachers/${teacher.id}`}>
                                                <div className="hover:text-primary">
                                                    <p className="font-medium">
                                                        {teacher.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {teacher.qualification}
                                                    </p>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4" />
                                                    {teacher.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4" />
                                                    {teacher.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{teacher.subject}</TableCell>
                                        <TableCell>{teacher.classTeacher}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    teacher.status === "active"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className={cn(
                                                    "flex w-fit items-center gap-1",
                                                    teacher.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                )}>
                                                {teacher.status === "active" ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <X className="h-3 w-3" />
                                                )}
                                                {teacher.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
