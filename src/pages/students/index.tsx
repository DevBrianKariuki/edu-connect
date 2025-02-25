import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StudentFormDialog from "@/components/students/StudentFormDialog";

interface ClassData {
    id: string;
    name: string;
    capacity: number;
    teacher: string;
    students: number;
}

const sampleClasses: ClassData[] = [
    {
        id: "1",
        name: "Grade 1",
        capacity: 30,
        teacher: "Mrs. Johnson",
        students: 25,
    },
    {
        id: "2",
        name: "Grade 2",
        capacity: 30,
        teacher: "Mr. Smith",
        students: 28,
    },
    {
        id: "3",
        name: "Grade 3",
        capacity: 35,
        teacher: "Ms. Davis",
        students: 32,
    },
];

export default function StudentsPage() {
    const [showAddClassDialog, setShowAddClassDialog] = useState(false);
    const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassCapacity, setNewClassCapacity] = useState("");
    const [newClassTeacher, setNewClassTeacher] = useState("");
    const { toast } = useToast();

    const handleAddClass = () => {
        // Here you would typically make an API call to add the class
        toast({
            title: "Class Added",
            description: `${newClassName} has been successfully added.`,
        });
        setShowAddClassDialog(false);
        setNewClassName("");
        setNewClassCapacity("");
        setNewClassTeacher("");
    };

    const handleAddStudent = async (data: any) => {
        try {
            // Here you would typically make an API call to add the student
            console.log("Adding student:", data);
            toast({
                title: "Success",
                description: "Student has been successfully added.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add student",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Students</h1>
                <div className="space-x-2">
                    <Dialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Class</DialogTitle>
                                <DialogDescription>
                                    Create a new class for your school. Fill in the details below.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="className">Class Name</Label>
                                    <Input
                                        id="className"
                                        placeholder="e.g., Grade 1"
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        placeholder="e.g., 30"
                                        value={newClassCapacity}
                                        onChange={(e) => setNewClassCapacity(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="teacher">Class Teacher</Label>
                                    <Input
                                        id="teacher"
                                        placeholder="e.g., Mrs. Johnson"
                                        value={newClassTeacher}
                                        onChange={(e) => setNewClassTeacher(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAddClassDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddClass}>Add Class</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={() => setShowAddStudentDialog(true)}>Add Student</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                        <CardDescription>Manage your school classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class Name</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead>Students</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sampleClasses.map((classData) => (
                                    <TableRow key={classData.id}>
                                        <TableCell className="font-medium">
                                            {classData.name}
                                        </TableCell>
                                        <TableCell>{classData.capacity}</TableCell>
                                        <TableCell>{classData.teacher}</TableCell>
                                        <TableCell>{classData.students}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Students List</CardTitle>
                        <CardDescription>Filter and manage students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <Input placeholder="Search by name..." />
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {sampleClasses.map((classData) => (
                                        <SelectItem key={classData.id} value={classData.id}>
                                            {classData.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Admission No.</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Guardian</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No students found
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <StudentFormDialog
                open={showAddStudentDialog}
                onOpenChange={setShowAddStudentDialog}
                onSubmit={handleAddStudent}
                classes={sampleClasses}
            />
        </div>
    );
}
