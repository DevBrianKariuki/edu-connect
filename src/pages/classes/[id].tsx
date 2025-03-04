
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, UserPlus, Users, Book, School } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton";
import StudentFormDialog from "@/components/students/StudentFormDialog";

interface ClassData {
    id: string;
    name: string;
    capacity: number;
    teacher: string;
    students: number;
    createdAt?: any;
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
    guardianContact: string;
    profilePhotoUrl?: string;
}

export default function ClassDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [classData, setClassData] = useState<ClassData | null>(null);
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!id) return;
        
        fetchClassDetails();
        fetchClassStudents();
    }, [id]);

    const fetchClassDetails = async () => {
        try {
            const classDocRef = doc(db, "classes", id!);
            const classSnapshot = await getDoc(classDocRef);
            
            if (classSnapshot.exists()) {
                setClassData({
                    id: classSnapshot.id,
                    ...classSnapshot.data() as Omit<ClassData, 'id'>
                });
            } else {
                toast({
                    title: "Error",
                    description: "Class not found",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            toast({
                title: "Error",
                description: "Failed to load class details",
                variant: "destructive",
            });
        }
    };

    const fetchClassStudents = async () => {
        try {
            setLoading(true);
            const studentsCollection = collection(db, "students");
            const q = query(studentsCollection, where("class", "==", id));
            const studentsSnapshot = await getDocs(q);
            
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
            console.error("Error fetching class students:", error);
            toast({
                title: "Error",
                description: "Failed to load students",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (data: any) => {
        try {
            // We'll reuse the same function logic but force the class to be the current class
            data.class = id;
            
            // Since the handleAddStudent function isn't directly accessible here,
            // you'd need to implement similar logic or refactor to share functionality
            
            // After adding the student, refresh the students list
            await fetchClassStudents();
            
            return true;
        } catch (error: any) {
            console.error("Error adding student:", error);
            throw new Error(error.message || "Failed to add student");
        }
    };

    const filteredStudents = students.filter(student => {
        if (!searchQuery) return true;
        
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || 
               student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/students">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">
                        {loading ? <Skeleton className="h-9 w-32" /> : classData?.name || "Class Details"}
                    </h1>
                </div>
                <Button onClick={() => setShowAddStudentDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student to Class
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="w-full">
                            <CardTitle className="text-sm font-medium">Students</CardTitle>
                            <p className="text-3xl font-bold">
                                {loading ? <Skeleton className="h-8 w-8" /> : students.length}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="w-full">
                            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                            <p className="text-3xl font-bold">
                                {loading ? <Skeleton className="h-8 w-8" /> : classData?.capacity || 0}
                            </p>
                        </div>
                        <School className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="w-full">
                            <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
                            <p className="text-lg font-medium truncate">
                                {loading ? <Skeleton className="h-6 w-32" /> : classData?.teacher || "Not assigned"}
                            </p>
                        </div>
                        <Book className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Students in {classData?.name}</CardTitle>
                    <CardDescription>
                        Manage students enrolled in this class
                    </CardDescription>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                            placeholder="Search students..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Admission No.</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Guardian</TableHead>
                                <TableHead>Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        <Skeleton className="h-20 w-full" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        {searchQuery 
                                            ? "No students match your search" 
                                            : "No students in this class yet"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
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
                                                <Link to={`/students/${student.id}`} className="hover:underline">
                                                    {student.firstName} {student.lastName}
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.admissionNumber}</TableCell>
                                        <TableCell>{student.gender}</TableCell>
                                        <TableCell>{student.guardianName}</TableCell>
                                        <TableCell>{student.guardianContact}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {classData && (
                <StudentFormDialog
                    open={showAddStudentDialog}
                    onOpenChange={setShowAddStudentDialog}
                    onSubmit={handleAddStudent}
                    classes={[classData]}
                    defaultClassId={id}
                />
            )}
        </div>
    );
}
