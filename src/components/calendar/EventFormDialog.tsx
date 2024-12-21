import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EventFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: EventFormData) => void;
}

export interface EventFormData {
	title: string;
	date: string;
	type: string;
	description: string;
}

export function EventFormDialog({
	open,
	onOpenChange,
	onSubmit,
}: EventFormDialogProps) {
	const [formData, setFormData] = React.useState<EventFormData>({
		title: "",
		date: new Date().toISOString().split("T")[0],
		type: "academic",
		description: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({
			title: "",
			date: new Date().toISOString().split("T")[0],
			type: "academic",
			description: "",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Event</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Event Title</Label>
						<Input
							id="title"
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
							placeholder="Enter event title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="date">Date</Label>
						<Input
							id="date"
							type="date"
							value={formData.date}
							onChange={(e) =>
								setFormData({
									...formData,
									date: e.target.value,
								})
							}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="type">Event Type</Label>
						<Select
							value={formData.type}
							onValueChange={(value) =>
								setFormData({ ...formData, type: value })
							}>
							<SelectTrigger>
								<SelectValue placeholder="Select event type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="academic">
									Academic
								</SelectItem>
								<SelectItem value="holiday">Holiday</SelectItem>
								<SelectItem value="exam">Exam</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							placeholder="Enter event description"
							required
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Add Event</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
