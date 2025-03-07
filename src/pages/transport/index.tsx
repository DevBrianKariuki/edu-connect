
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import BusManagement from "@/components/transport/BusManagement";
import DriversManagement from "@/components/transport/DriversManagement";
import RoutesManagement from "@/components/transport/RoutesManagement";
import LiveTracking from "@/components/transport/LiveTracking";
import StudentsManagement from "@/components/transport/StudentsManagement";
import { getBuses, getDrivers, getRoutes, getTransportStudents } from "@/lib/firebase/transport";
import { useToast } from "@/components/ui/use-toast";

const TransportPage = () => {
	const [activeTab, setActiveTab] = useState("buses");
	const [busCount, setBusCount] = useState(0);
	const [driverCount, setDriverCount] = useState(0);
	const [routeCount, setRouteCount] = useState(0);
	const [studentCount, setStudentCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const fetchTransportData = async () => {
			try {
				setLoading(true);
				const buses = await getBuses();
				const drivers = await getDrivers();
				const routes = await getRoutes();
				const students = await getTransportStudents();

				setBusCount(buses.length);
				setDriverCount(drivers.length);
				setRouteCount(routes.length);
				setStudentCount(students.length);
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

		fetchTransportData();
	}, [toast]);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Transport Management</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Total Buses</h3>
					<p className="text-3xl font-bold">{loading ? "-" : busCount}</p>
					<p className="text-sm text-muted-foreground">Active Fleet</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Drivers</h3>
					<p className="text-3xl font-bold">{loading ? "-" : driverCount}</p>
					<p className="text-sm text-muted-foreground">On Duty</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Routes</h3>
					<p className="text-3xl font-bold">{loading ? "-" : routeCount}</p>
					<p className="text-sm text-muted-foreground">Active Routes</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Students</h3>
					<p className="text-3xl font-bold">{loading ? "-" : studentCount}</p>
					<p className="text-sm text-muted-foreground">Using Transport</p>
				</div>
			</div>

			<Tabs defaultValue="buses" value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList>
					<TabsTrigger 
						value="buses"
						className={activeTab === "buses" ? "bg-[#8B5CF6] text-white" : ""}
					>
						Buses
					</TabsTrigger>
					<TabsTrigger 
						value="drivers"
						className={activeTab === "drivers" ? "bg-[#8B5CF6] text-white" : ""}
					>
						Drivers
					</TabsTrigger>
					<TabsTrigger 
						value="routes"
						className={activeTab === "routes" ? "bg-[#8B5CF6] text-white" : ""}
					>
						Routes
					</TabsTrigger>
					<TabsTrigger 
						value="students"
						className={activeTab === "students" ? "bg-[#8B5CF6] text-white" : ""}
					>
						Students
					</TabsTrigger>
					<TabsTrigger 
						value="tracking"
						className={activeTab === "tracking" ? "bg-[#8B5CF6] text-white" : ""}
					>
						Live Tracking
					</TabsTrigger>
				</TabsList>
				<TabsContent value="buses" className="mt-6">
					<BusManagement />
				</TabsContent>
				<TabsContent value="drivers" className="mt-6">
					<DriversManagement />
				</TabsContent>
				<TabsContent value="routes" className="mt-6">
					<RoutesManagement />
				</TabsContent>
				<TabsContent value="students" className="mt-6">
					<StudentsManagement />
				</TabsContent>
				<TabsContent value="tracking" className="mt-6">
					<LiveTracking />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransportPage;
