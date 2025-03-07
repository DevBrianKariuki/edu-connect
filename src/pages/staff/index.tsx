
import React, { useState, useEffect } from "react";
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
import { Search, Plus, Filter, Loader2, Trash2 } from "lucide-react";
import {
	StaffFormDialog,
	StaffFormData,
} from "@/components/staff/StaffFormDialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
	getAllStaffMembers, 
	StaffMember, 
	getStaffCountByDepartment,
	deleteStaffMember,
	getActiveStaffCount 
} from "@/lib/firebase/staff";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
	StaffStatCardSkeleton, 
	StaffTableSkeleton 
} from "@/components/staff/StaffSkeletons";
import { format } from "date-fns";

const StaffPage = () => {
	const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
	const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({});
	const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

	const departments = [
		"Mathematics",
		"English",
		"Science",
		"Social Studies",
		"Administration",
	];

	const fetchStaffData = async () => {
		try {
			setIsLoading(true);
			const staff = await getAllStaffMembers();
			setStaffMembers(staff);
			
			const counts = await getStaffCountByDepartment();
			setDepartmentCounts(counts);
		} catch (error) {
			console.error("Error fetching staff data:", error);
			toast.error("Failed to load staff data");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStaffData();
	}, []);

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

	const handleAddStaff = async (data: StaffFormData) => {
		await fetchStaffData();
		setShowAddStaffDialog(false);
	};

	const handleEditStaff = async (data: StaffFormData) => {
		await fetchStaffData();
		setEditingStaff(null);
	};

	const handleDeleteStaff = async () => {
		if (!staffToDelete) return;
		
		try {
			await deleteStaffMember(staffToDelete.id);
			toast.success("Staff member deleted successfully");
			fetchStaffData();
		} catch (error) {
			console.error("Error deleting staff member:", error);
			toast.error("Failed to delete staff member");
		} finally {
			setStaffToDelete(null);
		}
	};

	const formatJoinDate = (date: string | Date): string => {
		if (date instanceof Date) {
			return format(date, 'yyyy-MM-dd');
		}
		return date;
	};

	// Helper function to convert string date to Date object
	const ensureDateObject = (date: string | Date): Date => {
		if (date instanceof Date) {
			return date;
		}
		return new Date(date);
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
				{isLoading ? (
					<>
						<StaffStatCardSkeleton />
						<StaffStatCardSkeleton />
						<StaffStatCardSkeleton />
					</>
				) : (
					<>
						<Card className="dark:bg-secondary/30">
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
						<Card className="dark:bg-secondary/30">
							<CardHeader>
								<CardTitle className="text-lg">Departments</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">{Object.keys(departmentCounts).length}</p>
								<p className="text-sm text-muted-foreground">
									Academic & Administrative
								</p>
							</CardContent>
						</Card>
						<Card className="dark:bg-secondary/30">
							<CardHeader>
								<CardTitle className="text-lg">New Hires</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">
									{staffMembers.filter(staff => {
										const hireDate = new Date(staff.joinDate);
										const oneMonthAgo = new Date();
										oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
										return hireDate >= oneMonthAgo;
									}).length}
								</p>
								<p className="text-sm text-muted-foreground">This Month</p>
							</CardContent>
						</Card>
					</>
				)}
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

			<Card className="dark:bg-secondary/30">
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
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<StaffTableSkeleton />
							) : filteredStaff.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
										{searchTerm || selectedDepartment ? "No staff members match your search" : "No staff members found. Add your first staff member!"}
									</TableCell>
								</TableRow>
							) : (
								filteredStaff.map((staff) => (
									<TableRow
										key={staff.id}
										className="hover:bg-muted/50">
										<TableCell className="font-medium">
											{staff.name}
										</TableCell>
										<TableCell>{staff.role}</TableCell>
										<TableCell>{staff.department}</TableCell>
										<TableCell>{staff.email}</TableCell>
										<TableCell>{staff.phone}</TableCell>
										<TableCell>
											{formatJoinDate(staff.joinDate)}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													staff.status
												)}`}>
												{staff.status.charAt(0).toUpperCase() +
													staff.status.slice(1)}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end space-x-2">
												<Button 
													variant="ghost" 
													size="sm" 
													className="h-8 w-8 p-0"
													onClick={() => {
														// Convert staff data for the form dialog
														const staffDataForEdit = {
															...staff,
															joinDate: ensureDateObject(staff.joinDate)
														};
														setEditingStaff(staffDataForEdit);
													}}>
													<svg
														width="15"
														height="15"
														viewBox="0 0 15 15"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4">
														<path
															d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
															fill="currentColor"
															fillRule="evenodd"
															clipRule="evenodd">
														</path>
													</svg>
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50/50"
													onClick={() => setStaffToDelete(staff)}>
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

			<AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the staff member <span className="font-semibold">{staffToDelete?.name}</span>. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteStaff} className="bg-red-500 hover:bg-red-600">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default StaffPage;
