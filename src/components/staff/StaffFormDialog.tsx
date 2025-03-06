
import React, { useState, useRef } from "react";
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
import { Camera, X } from "lucide-react";
import { uploadImage } from "@/lib/utils";

const phoneRegex = /^\+?\d{10,15}$/;

const staffFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().refine((val) => phoneRegex.test(val), {
		message: "Invalid phone number format. Use +1234567890 or 1234567890",
	}),
	department: z.string().min(1, "Please select a department"),
	role: z.string().min(1, "Please select a role"),
	joinDate: z.string().min(1, "Join date is required"),
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
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		initialData?.profilePhotoUrl || null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<StaffFormData>({
		resolver: zodResolver(staffFormSchema),
		defaultValues: {
			name: initialData?.name || "",
			email: initialData?.email || "",
			phone: initialData?.phone || "",
			department: initialData?.department || "",
			role: initialData?.role || "",
			joinDate:
				initialData?.joinDate || new Date().toISOString().split("T")[0],
			status: initialData?.status || "active",
			profilePhotoUrl: initialData?.profilePhotoUrl || "",
		},
	});

	const handleSubmit = async (data: StaffFormData) => {
		try {
			setIsSubmitting(true);
			
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
			setPhotoPreview(null);
		} catch (error) {
			console.error("Error submitting staff form:", error);
			toast.error("Failed to submit staff details");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			// Preview the image
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) {
					setPhotoPreview(event.target.result as string);
				}
			};
			reader.readAsDataURL(file);

			// Upload the image
			const imageUrl = await uploadImage(file, "staff-photos");
			form.setValue("profilePhotoUrl", imageUrl);
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload profile photo");
		}
	};

	const removePhoto = () => {
		setPhotoPreview(null);
		form.setValue("profilePhotoUrl", "");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[650px] dark:bg-background dark:border-border">
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
							<div className="relative">
								<div 
									className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-primary/20"
									onClick={() => fileInputRef.current?.click()}
								>
									{photoPreview ? (
										<img 
											src={photoPreview} 
											alt="Profile Preview" 
											className="w-full h-full object-cover"
										/>
									) : (
										<Camera className="h-8 w-8 text-muted-foreground" />
									)}
								</div>
								{photoPreview && (
									<button
										type="button"
										className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
										onClick={removePhoto}
									>
										<X className="h-3 w-3" />
									</button>
								)}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleFileChange}
								/>
								<p className="text-xs text-center mt-2 text-muted-foreground">
									Click to upload photo
								</p>
							</div>
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
									<FormItem>
										<FormLabel>Join Date*</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
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
