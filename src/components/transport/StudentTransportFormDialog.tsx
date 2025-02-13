
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

const studentTransportFormSchema = z.object({
	name: z.string().min(1, "Student name is required"),
	class: z.string().min(1, "Class is required"),
	route: z.string().min(1, "Route is required"),
	bus: z.string().min(1, "Bus is required"),
	pickupPoint: z.string().min(1, "Pickup point is required"),
	dropoffPoint: z.string().min(1, "Drop-off point is required"),
	guardianContact: z.string().min(1, "Guardian contact is required"),
});

type StudentTransportFormData = z.infer<typeof studentTransportFormSchema>;

interface StudentTransportFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: StudentTransportFormData) => void;
}

const StudentTransportFormDialog = ({
	open,
	onOpenChange,
	onSubmit,
}: StudentTransportFormDialogProps) => {
	const form = useForm<StudentTransportFormData>({
		resolver: zodResolver(studentTransportFormSchema),
		defaultValues: {
			name: "",
			class: "",
			route: "",
			bus: "",
			pickupPoint: "",
			dropoffPoint: "",
			guardianContact: "",
		},
	});

	const handleSubmit = (data: StudentTransportFormData) => {
		onSubmit(data);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Transport Student</DialogTitle>
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
									<FormLabel>Student Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select class" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Grade 5">
												Grade 5
											</SelectItem>
											<SelectItem value="Grade 6">
												Grade 6
											</SelectItem>
											<SelectItem value="Grade 7">
												Grade 7
											</SelectItem>
											<SelectItem value="Grade 8">
												Grade 8
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="route"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Route</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select route" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Route A">
												Route A
											</SelectItem>
											<SelectItem value="Route B">
												Route B
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bus</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select bus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="KCB 123X">
												KCB 123X
											</SelectItem>
											<SelectItem value="KDG 456Y">
												KDG 456Y
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pickupPoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pickup Point</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dropoffPoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Drop-off Point</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="guardianContact"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Guardian Contact</FormLabel>
									<FormControl>
										<Input {...field} />
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
							<Button type="submit">Add Student</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default StudentTransportFormDialog;
