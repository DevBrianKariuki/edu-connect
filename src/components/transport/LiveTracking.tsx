
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LiveTracking = () => {
	const [selectedBus, setSelectedBus] = useState<string>("");

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Live Tracking</h2>
				<Select value={selectedBus} onValueChange={setSelectedBus}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Select bus" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="bus1">KCB 123X - Route A</SelectItem>
						<SelectItem value="bus2">KDG 456Y - Route B</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="h-[600px] rounded-lg border bg-card p-4">
				<div className="w-full h-full flex items-center justify-center text-muted-foreground">
					Google Maps integration will be implemented here to show real-time location of selected bus
				</div>
			</div>
		</div>
	);
};

export default LiveTracking;
