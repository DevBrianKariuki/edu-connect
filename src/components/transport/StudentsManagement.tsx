
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import StudentTransportFormDialog from "./StudentTransportFormDialog";

interface TransportStudent {
	id: string;
	name: string;
	class: string;
	route: string;
	bus: string;
	pickupPoint: string;
	dropoffPoint: string;
	guardianContact: string;
}

const mockStudents: TransportStudent[] = [
	{
		id: "1",
		name: "John Smith",
		class: "Grade 7",
		route: "Route A",
		bus: "KCB 123X",
		pickupPoint: "Westlands Mall",
		dropoffPoint: "School",
		guardianContact: "+254 712 345 678",
	},
	{
		id: "2",
		name: "Mary Johnson",
		class: "Grade 5",
		route: "Route B",
		bus: "KDG 456Y",
		pickupPoint: "Kilimani",
		dropoffPoint: "School",
		guardianContact: "+254 723 456 789",
	},
];

const StudentsManagement = () => {
	const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [selectedRoute, setSelectedRoute] = useState<string>("");
	const [selectedBus, setSelectedBus] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const filteredStudents = mockStudents.filter((student) => {
		const matchesClass = selectedClass
			? student.class === selectedClass
			: true;
		const matchesRoute = selectedRoute
			? student.route === selectedRoute
			: true;
		const matchesBus = selectedBus ? student.bus === selectedBus : true;
		const matchesSearch = searchQuery
			? student.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			: true;

		return matchesClass && matchesRoute && matchesBus && matchesSearch;
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Transport Students</h2>
				<Button
					onClick={() => setShowAddStudentDialog(true)}
					className="flex items-center gap-2">
					<Plus size={20} />
					Add Student
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<Input
						placeholder="Search by name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div>
					<Select
						value={selectedClass}
						onValueChange={setSelectedClass}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by class" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All Classes</SelectItem>
							<SelectItem value="Grade 5">Grade 5</SelectItem>
							<SelectItem value="Grade 6">Grade 6</SelectItem>
							<SelectItem value="Grade 7">Grade 7</SelectItem>
							<SelectItem value="Grade 8">Grade 8</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Select
						value={selectedRoute}
						onValueChange={setSelectedRoute}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by route" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All Routes</SelectItem>
							<SelectItem value="Route A">Route A</SelectItem>
							<SelectItem value="Route B">Route B</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Select value={selectedBus} onValueChange={setSelectedBus}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by bus" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All Buses</SelectItem>
							<SelectItem value="KCB 123X">KCB 123X</SelectItem>
							<SelectItem value="KDG 456Y">KDG 456Y</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Student Name</TableHead>
							<TableHead>Class</TableHead>
							<TableHead>Route</TableHead>
							<TableHead>Bus</TableHead>
							<TableHead>Pickup Point</TableHead>
							<TableHead>Drop-off Point</TableHead>
							<TableHead>Guardian Contact</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredStudents.map((student) => (
							<TableRow key={student.id}>
								<TableCell className="font-medium">
									{student.name}
								</TableCell>
								<TableCell>{student.class}</TableCell>
								<TableCell>{student.route}</TableCell>
								<TableCell>{student.bus}</TableCell>
								<TableCell>{student.pickupPoint}</TableCell>
								<TableCell>{student.dropoffPoint}</TableCell>
								<TableCell>{student.guardianContact}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<StudentTransportFormDialog
				open={showAddStudentDialog}
				onOpenChange={setShowAddStudentDialog}
				onSubmit={(data) => {
					console.log("Adding student:", data);
					setShowAddStudentDialog(false);
				}}
			/>
		</div>
	);
};

export default StudentsManagement;
