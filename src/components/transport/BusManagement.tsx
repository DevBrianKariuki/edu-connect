
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
import BusFormDialog from "./BusFormDialog";
import { Bus, getBuses, addBus } from "@/lib/firebase/transport";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const BusManagement = () => {
	const [showAddBusDialog, setShowAddBusDialog] = useState(false);
	const [buses, setBuses] = useState<Bus[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const fetchBuses = async () => {
		try {
			setLoading(true);
			const data = await getBuses();
			setBuses(data);
		} catch (error) {
			console.error("Error fetching buses:", error);
			toast({
				title: "Error",
				description: "Failed to load buses",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBuses();
	}, [toast]);

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

	const handleAddBus = async (data: any) => {
		try {
			const busData: Omit<Bus, 'id' | 'createdAt'> = {
				registrationNumber: data.registrationNumber,
				model: data.model,
				capacity: parseInt(data.capacity, 10),
				status: data.status,
				lastMaintenance: new Date(),
				assignedDriver: data.assignedDriver || undefined,
			};

			const busId = await addBus(busData);
			
			if (busId) {
				toast({
					title: "Success",
					description: "Bus added successfully",
				});
				setShowAddBusDialog(false);
				fetchBuses(); // Refresh the list
			} else {
				throw new Error("Failed to add bus");
			}
		} catch (error) {
			console.error("Error adding bus:", error);
			toast({
				title: "Error",
				description: "Failed to add bus",
				variant: "destructive",
			});
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
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-4">
									Loading buses...
								</TableCell>
							</TableRow>
						) : buses.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-4">
									No buses found. Add your first bus.
								</TableCell>
							</TableRow>
						) : (
							buses.map((bus) => (
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
									<TableCell>
										{format(new Date(bus.lastMaintenance), "yyyy-MM-dd")}
									</TableCell>
									<TableCell>
										{bus.assignedDriver || "Not assigned"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<BusFormDialog
				open={showAddBusDialog}
				onOpenChange={setShowAddBusDialog}
				onSubmit={handleAddBus}
			/>
		</div>
	);
};

export default BusManagement;
