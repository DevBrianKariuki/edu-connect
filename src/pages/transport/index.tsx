
import React, { useState } from "react";
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

const TransportPage = () => {
	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Transport Management</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Total Buses</h3>
					<p className="text-3xl font-bold">12</p>
					<p className="text-sm text-muted-foreground">Active Fleet</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Drivers</h3>
					<p className="text-3xl font-bold">8</p>
					<p className="text-sm text-muted-foreground">On Duty</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Routes</h3>
					<p className="text-3xl font-bold">15</p>
					<p className="text-sm text-muted-foreground">Active Routes</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Students</h3>
					<p className="text-3xl font-bold">150</p>
					<p className="text-sm text-muted-foreground">Using Transport</p>
				</div>
			</div>

			<Tabs defaultValue="buses" className="w-full">
				<TabsList>
					<TabsTrigger value="buses">Buses</TabsTrigger>
					<TabsTrigger value="drivers">Drivers</TabsTrigger>
					<TabsTrigger value="routes">Routes</TabsTrigger>
					<TabsTrigger value="students">Students</TabsTrigger>
					<TabsTrigger value="tracking">Live Tracking</TabsTrigger>
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
