
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
import BusFormDialog from "./BusFormDialog";

interface Bus {
	id: string;
	registrationNumber: string;
	model: string;
	capacity: number;
	status: "active" | "maintenance" | "inactive";
	lastMaintenance: string;
	assignedDriver?: string;
}

const mockBuses: Bus[] = [
	{
		id: "1",
		registrationNumber: "KCB 123X",
		model: "Toyota Coaster",
		capacity: 30,
		status: "active",
		lastMaintenance: "2024-02-15",
		assignedDriver: "John Doe",
	},
	{
		id: "2",
		registrationNumber: "KDG 456Y",
		model: "Isuzu ELF",
		capacity: 25,
		status: "maintenance",
		lastMaintenance: "2024-02-20",
	},
];

const BusManagement = () => {
	const [showAddBusDialog, setShowAddBusDialog] = useState(false);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "maintenance":
				return "bg-yellow-100 text-yellow-800";
			case "inactive":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">School Buses</h2>
				<Button
					onClick={() => setShowAddBusDialog(true)}
					className="flex items-center gap-2">
					<Plus size={20} />
					Add Bus
				</Button>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Registration No.</TableHead>
							<TableHead>Model</TableHead>
							<TableHead>Capacity</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Maintenance</TableHead>
							<TableHead>Assigned Driver</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mockBuses.map((bus) => (
							<TableRow key={bus.id}>
								<TableCell className="font-medium">
									{bus.registrationNumber}
								</TableCell>
								<TableCell>{bus.model}</TableCell>
								<TableCell>{bus.capacity} seats</TableCell>
								<TableCell>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
											bus.status
										)}`}>
										{bus.status.charAt(0).toUpperCase() +
											bus.status.slice(1)}
									</span>
								</TableCell>
								<TableCell>{bus.lastMaintenance}</TableCell>
								<TableCell>
									{bus.assignedDriver || "Not assigned"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<BusFormDialog
				open={showAddBusDialog}
				onOpenChange={setShowAddBusDialog}
				onSubmit={(data) => {
					console.log("Adding bus:", data);
					setShowAddBusDialog(false);
				}}
			/>
		</div>
	);
};

export default BusManagement;
