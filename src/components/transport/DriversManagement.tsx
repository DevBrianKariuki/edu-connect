
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
import DriverFormDialog from "./DriverFormDialog";
import { Driver, getDrivers, addDriver } from "@/lib/firebase/transport";
import { useToast } from "@/components/ui/use-toast";

const DriversManagement = () => {
	const [showAddDriverDialog, setShowAddDriverDialog] = useState(false);
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const fetchDrivers = async () => {
		try {
			setLoading(true);
			const data = await getDrivers();
			setDrivers(data);
		} catch (error) {
			console.error("Error fetching drivers:", error);
			toast({
				title: "Error",
				description: "Failed to load drivers",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDrivers();
	}, [toast]);

	const getStatusColor = (status: string) => {
		return status === "on duty"
			? "bg-green-100 text-green-800"
			: "bg-red-100 text-red-800";
	};

	const handleAddDriver = async (data: any) => {
		try {
			const driverData: Omit<Driver, 'id' | 'createdAt'> = {
				name: data.name,
				licenseNumber: data.licenseNumber,
				phone: data.phone,
				status: data.status,
				assignedBus: data.assignedBus || undefined,
				assignedRoute: data.assignedRoute || undefined,
			};

			const driverId = await addDriver(driverData);
			
			if (driverId) {
				toast({
					title: "Success",
					description: "Driver added successfully",
				});
				setShowAddDriverDialog(false);
				fetchDrivers(); // Refresh the list
			} else {
				throw new Error("Failed to add driver");
			}
		} catch (error) {
			console.error("Error adding driver:", error);
			toast({
				title: "Error",
				description: "Failed to add driver",
				variant: "destructive",
			});
		}
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
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-4">
									Loading drivers...
								</TableCell>
							</TableRow>
						) : drivers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-4">
									No drivers found. Add your first driver.
								</TableCell>
							</TableRow>
						) : (
							drivers.map((driver) => (
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
							))
						)}
					</TableBody>
				</Table>
			</div>

			<DriverFormDialog
				open={showAddDriverDialog}
				onOpenChange={setShowAddDriverDialog}
				onSubmit={handleAddDriver}
			/>
		</div>
	);
};

export default DriversManagement;
