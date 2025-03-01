
import { useState, useEffect } from "react";
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
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StudentFormDialog from "@/components/students/StudentFormDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/lib/auth/AuthContext";

interface ClassData {
    id: string;
    name: string;
    capacity: number;
    teacher: string;
    students: number;
}

interface StudentData {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    class: string;
    className?: string;
    dateOfBirth: string;
    gender: string;
    guardianName: string;
    guardianRelation: string;
    guardianContact: string;
    guardianEmail: string;
    address: string;
    profilePhotoUrl?: string;
    createdAt: Timestamp;
}

export default function StudentsPage() {
    const [showAddClassDialog, setShowAddClassDialog] = useState(false);
    const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassCapacity, setNewClassCapacity] = useState("");
    const [newClassTeacher, setNewClassTeacher] = useState("");
    const [students, setStudents] = useState<StudentData[]>([]);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [classesLoading, setClassesLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("all");
    const { toast } = useToast();
    const { state } = useAuth();

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, []);

    const fetchClasses = async () => {
        try {
            setClassesLoading(true);
            const classesCollection = collection(db, "classes");
            const classesSnapshot = await getDocs(classesCollection);
            
            const classesData: ClassData[] = [];
            
            classesSnapshot.forEach((doc) => {
                const data = doc.data() as Omit<ClassData, 'id'>;
                classesData.push({
                    id: doc.id,
                    ...data,
                });
            });
            
            setClasses(classesData);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast({
                title: "Error",
                description: "Failed to load classes",
                variant: "destructive",
            });
        } finally {
            setClassesLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const studentsCollection = collection(db, "students");
            const studentsSnapshot = await getDocs(studentsCollection);
            
            const studentsData: StudentData[] = [];
            
            studentsSnapshot.forEach((doc) => {
                const data = doc.data() as Omit<StudentData, 'id'>;
                studentsData.push({
                    id: doc.id,
                    ...data,
                });
            });
            
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to load students",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async () => {
        try {
            if (!newClassName || !newClassCapacity || !newClassTeacher) {
                toast({
                    title: "Error",
                    description: "Please fill in all fields",
                    variant: "destructive",
                });
                return;
            }

            // Add class to Firestore
            const classData = {
                name: newClassName,
                capacity: parseInt(newClassCapacity),
                teacher: newClassTeacher,
                students: 0,
                schoolId: state.user?.id || "unknown",
                createdAt: Timestamp.now()
            };
            
            await addDoc(collection(db, "classes"), classData);
            
            // Refresh classes
            fetchClasses();
            
            toast({
                title: "Class Added",
                description: `${newClassName} has been successfully added.`,
            });
            
            // Reset form and close dialog
            setShowAddClassDialog(false);
            setNewClassName("");
            setNewClassCapacity("");
            setNewClassTeacher("");
        } catch (error) {
            console.error("Error adding class:", error);
            toast({
                title: "Error",
                description: "Failed to add class",
                variant: "destructive",
            });
        }
    };

    const handleAddStudent = async (data: any) => {
        try {
            // Check if a class has been selected
            if (!data.class || data.class === "none") {
                toast({
                    title: "Error",
                    description: "Please select a class for the student",
                    variant: "destructive",
                });
                return false;
            }
            
            let profilePhotoUrl = "";
            
            // Upload profile photo if provided
            if (data.profilePhoto) {
                const storageRef = ref(storage, `student-photos/${Date.now()}-${data.profilePhoto.name}`);
                await uploadBytes(storageRef, data.profilePhoto);
                profilePhotoUrl = await getDownloadURL(storageRef);
            }
            
            // Get class name for better display
            const selectedClass = classes.find(c => c.id === data.class);
            
            // Add student data to Firestore
            const studentData = {
                firstName: data.firstName,
                lastName: data.lastName,
                admissionNumber: data.admissionNumber,
                class: data.class,
                className: selectedClass?.name || "Unknown Class",
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                guardianName: data.guardianName,
                guardianRelation: data.guardianRelation,
                guardianContact: data.guardianContact,
                guardianEmail: data.guardianEmail,
                address: data.address,
                profilePhotoUrl,
                createdAt: Timestamp.now(),
                schoolId: state.user?.id || "unknown" // Link student to school
            };
            
            await addDoc(collection(db, "students"), studentData);
            
            // Update class student count
            const classDoc = doc(db, "classes", data.class);
            // In a real app, you would use a transaction to increment the student count
            // For now, we'll just refresh the classes to get updated data
            fetchClasses();
            
            // Refresh the student list
            fetchStudents();
            
            return true;
        } catch (error: any) {
            console.error("Error adding student:", error);
            throw new Error(error.message || "Failed to add student");
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        try {
            // Delete student document
            await deleteDoc(doc(db, "students", studentId));
            
            // Refresh the student list
            fetchStudents();
            
            toast({
                title: "Success",
                description: "Student removed successfully",
            });
        } catch (error) {
            console.error("Error deleting student:", error);
            toast({
                title: "Error",
                description: "Failed to delete student",
                variant: "destructive",
            });
        }
    };

    // Filter students based on search query and selected class
    const filteredStudents = students.filter(student => {
        const matchesSearch = searchQuery
            ? `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
              student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
            
        const matchesClass = selectedClass === "all" 
            ? true 
            : student.class === selectedClass;
            
        return matchesSearch && matchesClass;
    });

    // Update student fields with class name for better display
    const studentsWithClassNames = filteredStudents.map(student => {
        const classInfo = classes.find(c => c.id === student.class);
        return {
            ...student,
            className: classInfo?.name || student.className || "Unknown Class"
        };
    });

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
                    <Button 
                        onClick={() => setShowAddStudentDialog(true)}
                        disabled={classes.length === 0}
                    >
                        Add Student
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                        <CardDescription>Manage your school classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {classesLoading ? (
                            <div className="text-center py-6">Loading classes...</div>
                        ) : classes.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                No classes found. Add your first class to get started.
                            </div>
                        ) : (
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
                                    {classes.map((classData) => (
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
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Students List</CardTitle>
                        <CardDescription>Filter and manage students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                    placeholder="Search by name or admission number..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((classData) => (
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        Loading students...
                                    </TableCell>
                                </TableRow>
                            ) : studentsWithClassNames.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        {classes.length === 0 
                                            ? "Add a class before adding students" 
                                            : "No students found"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                studentsWithClassNames.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    {student.profilePhotoUrl ? (
                                                        <AvatarImage src={student.profilePhotoUrl} alt={`${student.firstName} ${student.lastName}`} />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                {student.firstName} {student.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.admissionNumber}</TableCell>
                                        <TableCell>{student.className}</TableCell>
                                        <TableCell>{student.guardianName}</TableCell>
                                        <TableCell>{student.guardianContact}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
                                                            handleDeleteStudent(student.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4 text-destructive" />
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

            <StudentFormDialog
                open={showAddStudentDialog}
                onOpenChange={setShowAddStudentDialog}
                onSubmit={handleAddStudent}
                classes={classes}
            />
        </div>
    );
}
