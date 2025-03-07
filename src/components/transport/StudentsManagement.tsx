
import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
	TransportStudent, 
	getTransportStudents, 
	addTransportStudent,
	Route,
	getRoutes,
	Bus,
	getBuses
} from "@/lib/firebase/transport";

const StudentsManagement = () => {
	const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
	const [selectedClass, setSelectedClass] = useState<string>("all-classes");
	const [selectedRoute, setSelectedRoute] = useState<string>("all-routes");
	const [selectedBus, setSelectedBus] = useState<string>("all-buses");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [students, setStudents] = useState<TransportStudent[]>([]);
	const [routes, setRoutes] = useState<Route[]>([]);
	const [buses, setBuses] = useState<Bus[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const fetchData = async () => {
		try {
			setLoading(true);
			const [studentsData, routesData, busesData] = await Promise.all([
				getTransportStudents(),
				getRoutes(),
				getBuses()
			]);
			setStudents(studentsData);
			setRoutes(routesData);
			setBuses(busesData);
		} catch (error) {
			console.error("Error fetching transport data:", error);
			toast({
				title: "Error",
				description: "Failed to load transport data",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [toast]);

	const filteredStudents = students.filter((student) => {
		const matchesClass = selectedClass === "all-classes"
			? true
			: student.class === selectedClass;
		const matchesRoute = selectedRoute === "all-routes"
			? true
			: student.route === selectedRoute;
		const matchesBus = selectedBus === "all-buses"
			? true
			: student.bus === selectedBus;
		const matchesSearch = searchQuery
			? student.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			: true;

		return matchesClass && matchesRoute && matchesBus && matchesSearch;
	});

	const handleAddStudent = async (data: any) => {
		try {
			const studentData: Omit<TransportStudent, 'id' | 'createdAt'> = {
				name: data.name,
				class: data.class,
				route: data.route,
				bus: data.bus,
				pickupPoint: data.pickupPoint,
				dropoffPoint: data.dropoffPoint,
				guardianContact: data.guardianContact,
				profilePic: data.profilePic ? URL.createObjectURL(data.profilePic) : undefined,
			};
			
			const studentId = await addTransportStudent(studentData);
			
			if (studentId) {
				toast({
					title: "Success",
					description: "Student added successfully",
				});
				setShowAddStudentDialog(false);
				fetchData(); // Refresh the list
			} else {
				throw new Error("Failed to add student");
			}
		} catch (error) {
			console.error("Error adding student:", error);
			toast({
				title: "Error",
				description: "Failed to add student",
				variant: "destructive",
			});
		}
	};

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
							<SelectItem value="all-classes">All Classes</SelectItem>
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
							<SelectItem value="all-routes">All Routes</SelectItem>
							{routes.map(route => (
								<SelectItem key={route.id} value={route.name}>{route.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Select value={selectedBus} onValueChange={setSelectedBus}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by bus" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-buses">All Buses</SelectItem>
							{buses.map(bus => (
								<SelectItem key={bus.id} value={bus.registrationNumber}>{bus.registrationNumber}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Student</TableHead>
							<TableHead>Class</TableHead>
							<TableHead>Route</TableHead>
							<TableHead>Bus</TableHead>
							<TableHead>Pickup Point</TableHead>
							<TableHead>Drop-off Point</TableHead>
							<TableHead>Guardian Contact</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-4">
									Loading students...
								</TableCell>
							</TableRow>
						) : filteredStudents.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-4">
									No students found. Add your first transport student.
								</TableCell>
							</TableRow>
						) : (
							filteredStudents.map((student) => (
								<TableRow key={student.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<Avatar>
												{student.profilePic ? (
													<AvatarImage src={student.profilePic} alt={student.name} />
												) : (
													<AvatarFallback>
														{student.name.split(" ").map(n => n[0]).join("")}
													</AvatarFallback>
												)}
											</Avatar>
											<span>{student.name}</span>
										</div>
									</TableCell>
									<TableCell>{student.class}</TableCell>
									<TableCell>{student.route}</TableCell>
									<TableCell>{student.bus}</TableCell>
									<TableCell>{student.pickupPoint}</TableCell>
									<TableCell>{student.dropoffPoint}</TableCell>
									<TableCell>{student.guardianContact}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<StudentTransportFormDialog
				open={showAddStudentDialog}
				onOpenChange={setShowAddStudentDialog}
				onSubmit={handleAddStudent}
			/>
		</div>
	);
};

export default StudentsManagement;
