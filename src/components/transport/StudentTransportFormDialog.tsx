
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
import { ImagePlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const studentTransportFormSchema = z.object({
	name: z
		.string()
		.min(3, "Student name must be at least 3 characters")
		.regex(/^[a-zA-Z\s]*$/, "Name should only contain letters and spaces"),
	class: z.string().min(1, "Class is required"),
	route: z.string().min(1, "Route is required"),
	bus: z.string().min(1, "Bus is required"),
	pickupPoint: z.string().min(3, "Pickup point must be at least 3 characters"),
	dropoffPoint: z.string().min(3, "Drop-off point must be at least 3 characters"),
	guardianContact: z
		.string()
		.min(10, "Contact number must be at least 10 digits")
		.regex(/^[+]?[0-9\s-]+$/, "Invalid phone number format"),
	profilePic: z
		.any()
		.refine((file) => !file || file instanceof File, "Please upload a valid file")
		.refine(
			(file) => !file || file.size <= MAX_FILE_SIZE,
			"File size must be less than 5MB"
		)
		.refine(
			(file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
			"Only .jpg, .jpeg, .png and .webp files are accepted"
		)
		.optional(),
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
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
			profilePic: undefined,
		},
	});

	const handleSubmit = (data: StudentTransportFormData) => {
		onSubmit(data);
		form.reset();
		setPreviewUrl(null);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type and size
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			form.setError("profilePic", { 
				message: "Only .jpg, .jpeg, .png and .webp files are accepted" 
			});
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			form.setError("profilePic", { 
				message: "File size must be less than 5MB" 
			});
			return;
		}

		// Create preview
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		onChange(file);
	};

	const removeProfilePic = () => {
		form.setValue("profilePic", undefined);
		setPreviewUrl(null);
	};

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			if (!newOpen) {
				form.reset();
				setPreviewUrl(null);
			}
			onOpenChange(newOpen);
		}}>
			<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Transport Student</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4">
						
						{/* Profile Picture Upload */}
						<div className="flex justify-center mb-4">
							<FormField
								control={form.control}
								name="profilePic"
								render={({ field: { value, onChange, ...field } }) => (
									<FormItem className="flex flex-col items-center">
										<FormLabel className="cursor-pointer">
											{previewUrl ? (
												<div className="relative">
													<Avatar className="w-24 h-24">
														<AvatarImage src={previewUrl} alt="Preview" />
													</Avatar>
													<button 
														type="button"
														className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
														onClick={(e) => {
															e.preventDefault();
															removeProfilePic();
														}}
													>
														<X size={14} />
													</button>
												</div>
											) : (
												<div className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center bg-muted">
													<div className="flex flex-col items-center">
														<ImagePlus size={24} className="mb-1" />
														<span className="text-xs">Add Photo</span>
													</div>
												</div>
											)}
											<input
												type="file"
												className="hidden"
												accept="image/*"
												onChange={(e) => handleFileChange(e, onChange)}
												{...field}
											/>
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Student Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="John Smith" />
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
										<Input {...field} placeholder="E.g., Westlands Mall" />
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
										<Input {...field} placeholder="E.g., School" />
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
										<Input {...field} placeholder="E.g., +254 712 345 678" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									form.reset();
									setPreviewUrl(null);
									onOpenChange(false);
								}}>
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
