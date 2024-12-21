import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenSquare, Trash } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StudentProfile from "@/components/students/StudentProfile";
import StudentFormDialog from "@/components/students/StudentFormDialog";
import { useToast } from "@/components/ui/use-toast";

const StudentDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isEditing, setIsEditing] = React.useState(false);

	// Mock data - replace with actual data fetching
	const studentData = {
		admissionNo: "2024001",
		firstName: "John",
		lastName: "Kamau",
		class: "Grade 7",
		classTeacher: "Mrs. Jane Doe",
		classTeacherPhone: "+254712345678",
		gender: "Male",
		dateOfBirth: "2010-05-15",
		address: "123 Nairobi, Kenya",
		imageUrl:
			"https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
		parents: [
			{
				name: "James Kamau",
				phone: "+254712345678",
				email: "james.kamau@example.com",
				nationalId: "12345678",
				relationship: "Parent",
			},
		],
	};

	const mockClasses = ["Grade 7", "Grade 8", "Grade 9"];

	const handleDelete = () => {
		console.log("Delete student:", id);
		toast({
			title: "Student deleted",
			description: "The student has been successfully deleted.",
		});
		navigate("/students");
	};

	const handleEdit = (data: typeof studentData) => {
		console.log("Edit student:", data);
		toast({
			title: "Changes saved",
			description: "The student information has been updated.",
		});
		setIsEditing(false);
	};

	return (
		<div className="space-y-6 max-w-4xl mx-auto p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						to="/students"
						className="text-muted-foreground hover:text-primary">
						<ArrowLeft size={24} />
					</Link>
					<h1 className="text-2xl font-bold">Student Details</h1>
				</div>
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => setIsEditing(true)}
						className="bg-white hover:bg-gray-100">
						<PenSquare className="mr-2" size={16} />
						Edit
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								className="bg-red-600 hover:bg-red-700 text-white">
								<Trash className="mr-2" size={16} />
								Delete Student
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete the student's record from
									the system.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-white hover:bg-gray-100">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700">
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<StudentProfile student={studentData} />

			<StudentFormDialog
				open={isEditing}
				onOpenChange={setIsEditing}
				initialData={studentData}
				onSubmit={handleEdit}
				classes={mockClasses}
			/>
		</div>
	);
};

export default StudentDetails;
