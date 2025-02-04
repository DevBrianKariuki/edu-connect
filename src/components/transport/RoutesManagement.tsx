
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
import RouteFormDialog from "./RouteFormDialog";

interface Route {
	id: string;
	name: string;
	startPoint: string;
	endPoint: string;
	stops: number;
	assignedBus?: string;
	assignedDriver?: string;
	studentsCount: number;
}

const mockRoutes: Route[] = [
	{
		id: "1",
		name: "Route A",
		startPoint: "School",
		endPoint: "Westlands",
		stops: 5,
		assignedBus: "KCB 123X",
		assignedDriver: "John Doe",
		studentsCount: 25,
	},
	{
		id: "2",
		name: "Route B",
		startPoint: "School",
		endPoint: "Kilimani",
		stops: 4,
		studentsCount: 18,
	},
];

const RoutesManagement = () => {
	const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);

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
						{mockRoutes.map((route) => (
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
						))}
					</TableBody>
				</Table>
			</div>

			<RouteFormDialog
				open={showAddRouteDialog}
				onOpenChange={setShowAddRouteDialog}
				onSubmit={(data) => {
					console.log("Adding route:", data);
					setShowAddRouteDialog(false);
				}}
			/>
		</div>
	);
};

export default RoutesManagement;
