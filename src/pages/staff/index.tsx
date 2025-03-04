
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
import { Search, Plus, Filter } from "lucide-react";
import {
	StaffFormDialog,
	StaffFormData,
} from "@/components/staff/StaffFormDialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StaffMember {
	id: string;
	name: string;
	role: string;
	department: string;
	email: string;
	phone: string;
	joinDate: string;
	status: "active" | "inactive";
	imageUrl: string;
}

const mockStaffMembers: StaffMember[] = [
	{
		id: "1",
		name: "John Doe",
		role: "Teacher",
		department: "Mathematics",
		email: "john.doe@edukenya.com",
		phone: "+254 712 345 678",
		joinDate: "2023-01-15",
		status: "active",
		imageUrl:
			"https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
	},
	{
		id: "2",
		name: "Jane Smith",
		role: "Administrator",
		department: "Administration",
		email: "jane.smith@edukenya.com",
		phone: "+254 723 456 789",
		joinDate: "2023-02-01",
		status: "active",
		imageUrl:
			"https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
	},
];

const StaffPage = () => {
	const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
	const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
	const { toast } = useToast();

	const departments = [
		"Mathematics",
		"English",
		"Science",
		"Social Studies",
		"Administration",
	];

	const filteredStaff = staffMembers.filter((staff) => {
		const matchesSearch =
			staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			staff.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesDepartment = selectedDepartment
			? staff.department === selectedDepartment
			: true;
		return matchesSearch && matchesDepartment;
	});

	const getStatusColor = (status: string) => {
		return status === "active"
			? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
			: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
	};

	const handleAddStaff = (data: StaffFormData) => {
		const newStaffMember: StaffMember = {
			id: `${staffMembers.length + 1}`,
			name: data.name,
			role: data.role,
			department: data.department,
			email: data.email,
			phone: data.phone,
			joinDate: data.joinDate,
			status: data.status,
			imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
		};
		
		setStaffMembers([...staffMembers, newStaffMember]);
		toast({
			title: "Success",
			description: "Staff member has been added successfully.",
		});
		setShowAddStaffDialog(false);
	};

	const handleEditStaff = (data: StaffFormData) => {
		if (!editingStaff) return;
		
		const updatedStaffMembers = staffMembers.map((staff) => 
			staff.id === editingStaff.id ? {
				...staff,
				name: data.name,
				role: data.role,
				department: data.department,
				email: data.email,
				phone: data.phone,
				joinDate: data.joinDate,
				status: data.status,
			} : staff
		);
		
		setStaffMembers(updatedStaffMembers);
		toast({
			title: "Success",
			description: "Staff member has been updated successfully.",
		});
		setEditingStaff(null);
	};

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Staff Management</h1>
				<Button
					onClick={() => setShowAddStaffDialog(true)}
					className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
					<Plus size={20} />
					Add Staff Member
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Total Staff</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">
							{staffMembers.length}
						</p>
						<p className="text-sm text-muted-foreground">Active Members</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Departments</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{departments.length}</p>
						<p className="text-sm text-muted-foreground">
							Academic & Administrative
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">New Hires</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">2</p>
						<p className="text-sm text-muted-foreground">This Month</p>
					</CardContent>
				</Card>
			</div>

			<div className="flex gap-4 items-center">
				<div className="relative flex-1">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
						size={20}
					/>
					<Input
						placeholder="Search by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="relative">
					<select
						value={selectedDepartment}
						onChange={(e) => setSelectedDepartment(e.target.value)}
						className="h-10 rounded-md border border-input bg-background dark:bg-secondary px-3 py-2 text-sm ring-offset-background">
						<option value="">All Departments</option>
						{departments.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>
					<Filter
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
						size={20}
					/>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Department</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Join Date</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredStaff.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
										No staff members found
									</TableCell>
								</TableRow>
							) : (
								filteredStaff.map((staff) => (
									<TableRow
										key={staff.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => setEditingStaff(staff)}>
										<TableCell className="font-medium">
											{staff.name}
										</TableCell>
										<TableCell>{staff.role}</TableCell>
										<TableCell>{staff.department}</TableCell>
										<TableCell>{staff.email}</TableCell>
										<TableCell>{staff.phone}</TableCell>
										<TableCell>{staff.joinDate}</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													staff.status
												)}`}>
												{staff.status.charAt(0).toUpperCase() +
													staff.status.slice(1)}
											</span>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<StaffFormDialog
				open={showAddStaffDialog}
				onOpenChange={setShowAddStaffDialog}
				onSubmit={handleAddStaff}
			/>

			{editingStaff && (
				<StaffFormDialog
					open={!!editingStaff}
					onOpenChange={(open) => !open && setEditingStaff(null)}
					onSubmit={handleEditStaff}
					initialData={editingStaff}
				/>
			)}
		</div>
	);
};

export default StaffPage;
