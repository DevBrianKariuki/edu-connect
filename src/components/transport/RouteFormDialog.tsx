
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const routeFormSchema = z.object({
	name: z.string().min(1, "Route name is required"),
	startPoint: z.string().min(1, "Start point is required"),
	endPoint: z.string().min(1, "End point is required"),
	stops: z.string().min(1, "Number of stops is required"),
});

type RouteFormData = z.infer<typeof routeFormSchema>;

interface RouteFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: RouteFormData) => void;
}

const RouteFormDialog = ({
	open,
	onOpenChange,
	onSubmit,
}: RouteFormDialogProps) => {
	const form = useForm<RouteFormData>({
		resolver: zodResolver(routeFormSchema),
		defaultValues: {
			name: "",
			startPoint: "",
			endPoint: "",
			stops: "",
		},
	});

	const handleSubmit = (data: RouteFormData) => {
		onSubmit(data);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Route</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Route Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startPoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Point</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endPoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Point</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stops"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Number of Stops</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="1"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit">Add Route</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default RouteFormDialog;
