import React, { useState } from "react";
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
import { toast } from "sonner";
import { addStaffMember, updateStaffMember } from "@/lib/firebase/staff";
import ProfileImageUpload from "@/components/shared/ProfileImageUpload";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const phoneRegex = /^\+?\d{10,15}$/;

const staffFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().refine((val) => phoneRegex.test(val), {
		message: "Invalid phone number format. Use +1234567890 or 1234567890",
	}),
	department: z.string().min(1, "Please select a department"),
	role: z.string().min(1, "Please select a role"),
	joinDate: z.date({
		required_error: "Join date is required",
	}),
	status: z.enum(["active", "inactive"]),
	profilePhotoUrl: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffFormSchema>;

interface StaffFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: StaffFormData) => void;
	initialData?: Partial<StaffFormData> & { id?: string };
}

export function StaffFormDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
}: StaffFormDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<StaffFormData>({
		resolver: zodResolver(staffFormSchema),
		defaultValues: {
			name: initialData?.name || "",
			email: initialData?.email || "",
			phone: initialData?.phone || "",
			department: initialData?.department || "",
			role: initialData?.role || "",
			joinDate: initialData?.joinDate ? new Date(initialData.joinDate) : new Date(),
			status: initialData?.status || "active",
			profilePhotoUrl: initialData?.profilePhotoUrl || "",
		},
	});

	const handleSubmit = async (data: StaffFormData) => {
		try {
			setIsSubmitting(true);
			
			// Use data as is - the Firebase functions will handle Date conversion
			if (initialData?.id) {
				// Update existing staff member
				await updateStaffMember(initialData.id, data);
				toast.success("Staff details updated successfully");
			} else {
				// Add new staff member
				await addStaffMember(data);
				toast.success("New staff member added successfully");
			}
			
			onSubmit(data);
			form.reset();
		} catch (error) {
			console.error("Error submitting staff form:", error);
			toast.error("Failed to submit staff details");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						{initialData
							? "Edit Staff Member"
							: "Add New Staff Member"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						
						{/* Profile Photo */}
						<div className="flex justify-center mb-6">
							<ProfileImageUpload
								control={form.control}
								name="profilePhotoUrl"
								initialImage={initialData?.profilePhotoUrl}
								getInitials={() => {
									const name = form.getValues().name;
									return name ? name.charAt(0).toUpperCase() : "S";
								}}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name*</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email*</FormLabel>
										<FormControl>
											<Input
												placeholder="john@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number*</FormLabel>
										<FormControl>
											<Input
												placeholder="+254 XXX XXX XXX"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="department"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department*</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select department" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="dark:bg-secondary">
												<SelectItem value="Mathematics">
													Mathematics
												</SelectItem>
												<SelectItem value="English">
													English
												</SelectItem>
												<SelectItem value="Science">
													Science
												</SelectItem>
												<SelectItem value="Social Studies">
													Social Studies
												</SelectItem>
												<SelectItem value="Administration">
													Administration
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role*</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="dark:bg-secondary">
												<SelectItem value="Teacher">
													Teacher
												</SelectItem>
												<SelectItem value="Head of Department">
													Head of Department
												</SelectItem>
												<SelectItem value="Administrator">
													Administrator
												</SelectItem>
												<SelectItem value="Support Staff">
													Support Staff
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="joinDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Join Date*</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
													className={cn("p-3 pointer-events-auto")}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status*</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="dark:bg-secondary">
											<SelectItem value="active">
												Active
											</SelectItem>
											<SelectItem value="inactive">
												Inactive
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>Submitting...</>
								) : initialData ? (
									"Update Staff"
								) : (
									"Add Staff"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
