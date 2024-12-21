import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StudentFormDialog from "@/components/students/StudentFormDialog";
import type { StudentFormData } from "@/components/students/StudentFormDialog";
import { useToast } from "@/components/ui/use-toast";

interface Student {
	id: string;
	admissionNo: string;
	name: string;
	class: string;
	gender: string;
	joinDate: string;
}

const mockStudents: Student[] = [
	{
		id: "1",
		admissionNo: "2024001",
		name: "John Kamau",
		class: "Grade 7",
		gender: "Male",
		joinDate: "2024-01-15",
	},
	{
		id: "2",
		admissionNo: "2024002",
		name: "Sarah Wanjiku",
		class: "Grade 6",
		gender: "Female",
		joinDate: "2024-01-16",
	},
];

const mockClasses = ["Grade 6", "Grade 7", "Grade 8"];

const StudentsPage = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [isAddingStudent, setIsAddingStudent] = useState(false);

	const filteredStudents = mockStudents.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.admissionNo
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		const matchesClass = selectedClass
			? student.class === selectedClass
			: true;
		return matchesSearch && matchesClass;
	});

	const handleExport = (format: "pdf" | "csv" | "xlsx") => {
		console.log(`Exporting as ${format}`);
		toast({
			title: "Export started",
			description: `Exporting student list as ${format.toUpperCase()}`,
		});
	};

	const handleAddStudent = (data: any) => {
		console.log("Adding new student:", data);
		toast({
			title: "Student added",
			description: "The new student has been successfully added.",
		});
		setIsAddingStudent(false);
	};

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Students</h1>
				<div className="flex gap-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="bg-white hover:bg-gray-100">
								<FileDown className="mr-2" size={16} />
								Export
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onClick={() => handleExport("pdf")}>
								Export as PDF
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleExport("csv")}>
								Export as CSV
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleExport("xlsx")}>
								Export as Excel
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						onClick={() => setIsAddingStudent(true)}
						className="bg-primary text-white hover:bg-primary/90">
						<Plus size={20} className="mr-2" />
						Add Student
					</Button>
				</div>
			</div>

			<div className="flex gap-4 items-center">
				<div className="relative flex-1">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<Input
						placeholder="Search by name or admission number..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="relative">
					<select
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10">
						<option value="">All Classes</option>
						{mockClasses.map((className) => (
							<option key={className} value={className}>
								{className}
							</option>
						))}
					</select>
					<Filter
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
						size={20}
					/>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Admission No.</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Class</TableHead>
							<TableHead>Gender</TableHead>
							<TableHead>Join Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredStudents.map((student, index) => (
							<TableRow
								key={student.id}
								className={`cursor-pointer hover:bg-gray-50 ${
									index % 2 === 0 ? "bg-gray-50/30" : ""
								}`}
								onClick={() =>
									navigate(`/students/${student.id}`)
								}>
								<TableCell>{student.admissionNo}</TableCell>
								<TableCell>{student.name}</TableCell>
								<TableCell>{student.class}</TableCell>
								<TableCell>{student.gender}</TableCell>
								<TableCell>{student.joinDate}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<StudentFormDialog
				open={isAddingStudent}
				onOpenChange={setIsAddingStudent}
				onSubmit={handleAddStudent}
				classes={mockClasses}
			/>
		</div>
	);
};

export default StudentsPage;
