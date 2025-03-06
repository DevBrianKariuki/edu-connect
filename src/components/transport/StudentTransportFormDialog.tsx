
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
import { CalendarIcon } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ProfileImageUpload from "@/components/shared/ProfileImageUpload";

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
	dateOfBirth: z.date({
		required_error: "Date of birth is required",
	}),
	profilePic: z.string().optional(),
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
	const [classes, setClasses] = useState<ClassData[]>([]);
	const [loading, setLoading] = useState(true);
	const [savedFormState, setSavedFormState] = useState<any>(null);
	const [datePickerOpen, setDatePickerOpen] = useState(false);

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
			dateOfBirth: undefined,
			profilePic: "",
		},
	});

	useEffect(() => {
		if (open && savedFormState) {
			Object.entries(savedFormState).forEach(([key, value]) => {
                // Handle date conversion
                if (key === 'dateOfBirth' && value) {
                    form.setValue(key as any, new Date(value as string));
                } else {
                    form.setValue(key as any, value);
                }
			});
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
		setSavedFormState(null);
	};

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			if (!newOpen) {
				const currentValues = form.getValues();
				setSavedFormState({
					...currentValues
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
							<ProfileImageUpload
								control={form.control}
								name="profilePic"
								getInitials={() => {
									const name = form.getValues().name;
									return name ? name.charAt(0).toUpperCase() : "ST";
								}}
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
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date of Birth</FormLabel>
									<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
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
												onSelect={(date) => {
													field.onChange(date);
													setDatePickerOpen(false);
												}}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
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
										...currentValues
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
