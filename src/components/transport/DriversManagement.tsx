
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
import DriverFormDialog from "./DriverFormDialog";

interface Driver {
	id: string;
	name: string;
	licenseNumber: string;
	phone: string;
	status: "on duty" | "off duty";
	assignedBus?: string;
	assignedRoute?: string;
}

const mockDrivers: Driver[] = [
	{
		id: "1",
		name: "John Doe",
		licenseNumber: "DL123456",
		phone: "+254 712 345 678",
		status: "on duty",
		assignedBus: "KCB 123X",
		assignedRoute: "Route A",
	},
	{
		id: "2",
		name: "Jane Smith",
		licenseNumber: "DL789012",
		phone: "+254 723 456 789",
		status: "off duty",
	},
];

const DriversManagement = () => {
	const [showAddDriverDialog, setShowAddDriverDialog] = useState(false);

	const getStatusColor = (status: string) => {
		return status === "on duty"
			? "bg-green-100 text-green-800"
			: "bg-red-100 text-red-800";
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Drivers</h2>
				<Button
					onClick={() => setShowAddDriverDialog(true)}
					className="flex items-center gap-2">
					<Plus size={20} />
					Add Driver
				</Button>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>License Number</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Assigned Bus</TableHead>
							<TableHead>Assigned Route</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mockDrivers.map((driver) => (
							<TableRow key={driver.id}>
								<TableCell className="font-medium">
									{driver.name}
								</TableCell>
								<TableCell>{driver.licenseNumber}</TableCell>
								<TableCell>{driver.phone}</TableCell>
								<TableCell>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
											driver.status
										)}`}>
										{driver.status.charAt(0).toUpperCase() +
											driver.status.slice(1)}
									</span>
								</TableCell>
								<TableCell>
									{driver.assignedBus || "Not assigned"}
								</TableCell>
								<TableCell>
									{driver.assignedRoute || "Not assigned"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<DriverFormDialog
				open={showAddDriverDialog}
				onOpenChange={setShowAddDriverDialog}
				onSubmit={(data) => {
					console.log("Adding driver:", data);
					setShowAddDriverDialog(false);
				}}
			/>
		</div>
	);
};

export default DriversManagement;
