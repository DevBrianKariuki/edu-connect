
import React, { useState, useEffect } from "react";
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
	FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImagePlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const validateKenyanPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s+|-|\(|\)/g, '');
    const kenyanRegex = /^(?:\+254|0)([17]\d{8}|[2-9]\d{7})$/;
    return kenyanRegex.test(cleanPhone);
};

const formatToKenyanPhone = (phone: string): string => {
    if (!phone) return phone;
    
    const cleanPhone = phone.replace(/\s+|-|\(|\)/g, '');
    
    if (cleanPhone.startsWith('+254')) {
        return cleanPhone;
    }
    
    if (cleanPhone.startsWith('0')) {
        return '+254' + cleanPhone.substring(1);
    }
    
    return '+254' + cleanPhone;
};

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
		.min(1, "Contact is required")
		.refine(validateKenyanPhone, {
            message: "Please enter a valid Kenyan phone number (+254XXXXXXXXX or 07XXXXXXXX)"
        }),
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

interface ClassData {
    id: string;
    name: string;
    capacity: number;
    teacher: string;
    students: number;
}

const StudentTransportFormDialog = ({
	open,
	onOpenChange,
	onSubmit,
}: StudentTransportFormDialogProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [classes, setClasses] = useState<ClassData[]>([]);
	const [loading, setLoading] = useState(true);
	const [savedFormState, setSavedFormState] = useState<any>(null);

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

	// Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);

	useEffect(() => {
		if (open && savedFormState) {
		    // Clean up previous preview URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
			Object.entries(savedFormState).forEach(([key, value]) => {
			    // Skip profilePic as it needs special handling
                if (key === 'profilePic') return;
                
				form.setValue(key as any, value);
			});
			
			if (savedFormState.previewUrl) {
				setPreviewUrl(savedFormState.previewUrl);
			}
			
			// If there was a saved file, we need to handle it specially
            if (savedFormState.profilePic instanceof File) {
                form.setValue('profilePic', savedFormState.profilePic);
            }
		}
	}, [open, form, savedFormState]);

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				setLoading(true);
				const classesCollection = collection(db, "classes");
				const classesSnapshot = await getDocs(classesCollection);
				
				const classesData: ClassData[] = [];
				
				classesSnapshot.forEach((doc) => {
					const data = doc.data() as Omit<ClassData, 'id'>;
					classesData.push({
						id: doc.id,
						...data,
					});
				});
				
				setClasses(classesData);
			} catch (error) {
				console.error("Error fetching classes:", error);
			} finally {
				setLoading(false);
			}
		};

		if (open) {
			fetchClasses();
		}
	}, [open]);

	const handleSubmit = (data: StudentTransportFormData) => {
		const formattedData = {
			...data,
			guardianContact: formatToKenyanPhone(data.guardianContact),
		};
		
		onSubmit(formattedData);
		form.reset();
		if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
		setSavedFormState(null);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
		const file = e.target.files?.[0];
		if (!file) return;

        // Clean up previous preview URL if it exists
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

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

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		onChange(file);
	};

	const removeProfilePic = () => {
		form.setValue("profilePic", undefined);
		if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
	};

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			if (!newOpen) {
				const currentValues = form.getValues();
				setSavedFormState({
					...currentValues,
					previewUrl: previewUrl
				});
			}
			onOpenChange(newOpen);
		}}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Transport Student</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4">
						
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
                                                        <AvatarFallback>
                                                            {form.getValues().name?.[0] || 'ST'}
                                                        </AvatarFallback>
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
										value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select class" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{loading ? (
												<SelectItem value="" disabled>Loading classes...</SelectItem>
											) : classes.length === 0 ? (
												<SelectItem value="" disabled>No classes available</SelectItem>
											) : (
												classes.map((classData) => (
													<SelectItem key={classData.id} value={classData.id}>
														{classData.name}
													</SelectItem>
												))
											)}
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
										value={field.value}>
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
										value={field.value}>
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
										<Input {...field} placeholder="+254 7XX XXX XXX" />
									</FormControl>
									<FormDescription className="text-xs">
                                        Enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)
                                    </FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									const currentValues = form.getValues();
									setSavedFormState({
										...currentValues,
										previewUrl: previewUrl
									});
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
