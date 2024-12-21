import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Parent {
	name: string;
	phone: string;
	email: string;
	nationalId: string;
	relationship: string;
}

export type StudentFormData = {
	admissionNo: string;
	firstName: string;
	lastName: string;
	class: string;
	classTeacher: string;
	classTeacherPhone: string;
	gender: string;
	dateOfBirth: string;
	address: string;
	imageUrl?: string;
	parents: {
		name: string;
		phone: string;
		email: string;
		nationalId: string;
		relationship: string;
	}[];
};

interface StudentFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData?: StudentFormData;
	onSubmit: (data: StudentFormData) => void;
	classes: string[];
}

const StudentFormDialog = ({
	open,
	onOpenChange,
	initialData,
	onSubmit,
	classes,
}: StudentFormDialogProps) => {
	const [step, setStep] = React.useState(1);
	const { toast } = useToast();
	const form = useForm<StudentFormData>({
		defaultValues: initialData || {
			admissionNo: "",
			firstName: "",
			lastName: "",
			class: "",
			classTeacher: "",
			classTeacherPhone: "",
			gender: "",
			dateOfBirth: "",
			address: "",
			imageUrl: "",
			parents: [
				{
					name: "",
					phone: "",
					email: "",
					nationalId: "",
					relationship: "Parent",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "parents",
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
				toast({
					title: "Invalid file type",
					description: "Please upload only JPG, JPEG or PNG images",
					variant: "destructive",
				});
				return;
			}
			form.setValue("imageUrl", URL.createObjectURL(file));
		}
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Student Photo</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept=".jpg,.jpeg,.png"
											onChange={handleImageChange}
											className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="admissionNo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Admission Number</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				);
			case 2:
				return (
					<div className="space-y-4">
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
												<SelectValue placeholder="Select a class" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{classes.map((className) => (
												<SelectItem
													key={className}
													value={className}>
													{className}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="gender"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Male">
												Male
											</SelectItem>
											<SelectItem value="Female">
												Female
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				);
			case 3:
				return (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Parents/Guardians
							</h3>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									append({
										name: "",
										phone: "",
										email: "",
										nationalId: "",
										relationship: "Guardian",
									})
								}>
								<Plus className="w-4 h-4 mr-2" />
								Add Parent/Guardian
							</Button>
						</div>
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="space-y-4 p-4 border rounded-lg relative">
								{index > 0 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-2 top-2"
										onClick={() => remove(index)}>
										<Trash2 className="w-4 h-4 text-red-500" />
									</Button>
								)}
								<FormField
									control={form.control}
									name={`parents.${index}.name`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`parents.${index}.phone`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input {...field} type="tel" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`parents.${index}.email`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`parents.${index}.nationalId`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>National ID</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`parents.${index}.relationship`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Relationship</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select relationship" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Parent">
														Parent
													</SelectItem>
													<SelectItem value="Guardian">
														Guardian
													</SelectItem>
													<SelectItem value="Other">
														Other
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Edit Student" : "Add New Student"} -
						Step {step} of 3
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6">
						{renderStep()}
						<div className="flex justify-between">
							{step > 1 && (
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}>
									Previous
								</Button>
							)}
							{step < 3 ? (
								<Button
									type="button"
									onClick={nextStep}
									className="ml-auto">
									Next
								</Button>
							) : (
								<Button
									type="submit"
									className="ml-auto bg-primary text-white hover:bg-primary/90">
									{initialData
										? "Save Changes"
										: "Add Student"}
								</Button>
							)}
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { StudentFormDialog };
export default StudentFormDialog;
