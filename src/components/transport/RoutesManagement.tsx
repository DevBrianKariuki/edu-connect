
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
import RouteFormDialog from "./RouteFormDialog";
import { Route, getRoutes, addRoute } from "@/lib/firebase/transport";
import { useToast } from "@/components/ui/use-toast";

const RoutesManagement = () => {
	const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);
	const [routes, setRoutes] = useState<Route[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const fetchRoutes = async () => {
		try {
			setLoading(true);
			const data = await getRoutes();
			setRoutes(data);
		} catch (error) {
			console.error("Error fetching routes:", error);
			toast({
				title: "Error",
				description: "Failed to load routes",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRoutes();
	}, [toast]);

	const handleAddRoute = async (data: any) => {
		try {
			const routeData: Omit<Route, 'id' | 'createdAt'> = {
				name: data.name,
				startPoint: data.startPoint,
				endPoint: data.endPoint,
				stops: parseInt(data.stops, 10),
				assignedBus: data.assignedBus || undefined,
				assignedDriver: data.assignedDriver || undefined,
				studentsCount: 0, // Default to 0 students
			};

			const routeId = await addRoute(routeData);
			
			if (routeId) {
				toast({
					title: "Success",
					description: "Route added successfully",
				});
				setShowAddRouteDialog(false);
				fetchRoutes(); // Refresh the list
			} else {
				throw new Error("Failed to add route");
			}
		} catch (error) {
			console.error("Error adding route:", error);
			toast({
				title: "Error",
				description: "Failed to add route",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Routes</h2>
				<Button
					onClick={() => setShowAddRouteDialog(true)}
					className="flex items-center gap-2">
					<Plus size={20} />
					Add Route
				</Button>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route Name</TableHead>
							<TableHead>Start Point</TableHead>
							<TableHead>End Point</TableHead>
							<TableHead>Stops</TableHead>
							<TableHead>Assigned Bus</TableHead>
							<TableHead>Assigned Driver</TableHead>
							<TableHead>Students</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-4">
									Loading routes...
								</TableCell>
							</TableRow>
						) : routes.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-4">
									No routes found. Add your first route.
								</TableCell>
							</TableRow>
						) : (
							routes.map((route) => (
								<TableRow key={route.id}>
									<TableCell className="font-medium">
										{route.name}
									</TableCell>
									<TableCell>{route.startPoint}</TableCell>
									<TableCell>{route.endPoint}</TableCell>
									<TableCell>{route.stops} stops</TableCell>
									<TableCell>
										{route.assignedBus || "Not assigned"}
									</TableCell>
									<TableCell>
										{route.assignedDriver || "Not assigned"}
									</TableCell>
									<TableCell>{route.studentsCount}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<RouteFormDialog
				open={showAddRouteDialog}
				onOpenChange={setShowAddRouteDialog}
				onSubmit={handleAddRoute}
			/>
		</div>
	);
};

export default RoutesManagement;
