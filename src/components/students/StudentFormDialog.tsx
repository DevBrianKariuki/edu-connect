import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const dateStringSchema = z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(selectedDate.getTime()) && selectedDate <= today;
    }, "Date cannot be in the future");

const studentFormSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    admissionNumber: z.string().min(1, "Admission number is required"),
    class: z.string().min(1, "Class is required"),
    dateOfBirth: dateStringSchema,
    gender: z.string().min(1, "Gender is required"),
    guardianName: z.string().min(2, "Guardian name is required"),
    guardianRelation: z.string().min(2, "Guardian relation is required"),
    guardianContact: z.string().min(10, "Valid contact number is required"),
    guardianEmail: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is required"),
    profilePhoto: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            "File size must be less than 5MB"
        )
        .refine(
            (file) => !file || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
            "Only JPEG, JPG, PNG, and WEBP formats are supported"
        ),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: StudentFormData) => void;
    classes: Array<{ id: string; name: string }>;
}

export default function StudentFormDialog({ open, onOpenChange, onSubmit, classes }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<StudentFormData>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            admissionNumber: "",
            class: "",
            dateOfBirth: "",
            gender: "",
            guardianName: "",
            guardianRelation: "",
            guardianContact: "",
            guardianEmail: "",
            address: "",
        },
    });

    const handleSubmit = async (data: StudentFormData) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data);
            form.reset();
            setProfilePreview(null);
            onOpenChange(false);
            toast({
                title: "Success",
                description: "Student data saved successfully",
            });
        } catch (error) {
            console.error("Error submitting student form:", error);
            toast({
                title: "Error",
                description: "Failed to add student",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            form.setError('profilePhoto', { 
                message: 'Only JPEG, JPG, PNG, and WEBP formats are supported' 
            });
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            form.setError('profilePhoto', { 
                message: 'File size must be less than 5MB' 
            });
            return;
        }
        
        form.setValue('profilePhoto', file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setProfilePreview(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const removeProfilePhoto = () => {
        form.setValue('profilePhoto', undefined);
        setProfilePreview(null);
        form.clearErrors('profilePhoto');
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            form.setValue('dateOfBirth', format(date, "yyyy-MM-dd"));
            form.trigger('dateOfBirth');
            setTimeout(() => setDatePickerOpen(false), 100);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                form.reset();
                setProfilePreview(null);
            }
            onOpenChange(isOpen);
        }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Fill in the student's details below to add them to the system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className={cn(
                                    "flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-full cursor-pointer hover:border-primary transition-colors",
                                    form.formState.errors.profilePhoto && "border-red-500"
                                )}>
                                    {profilePreview ? (
                                        <img
                                            src={profilePreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ImagePlus className="w-8 h-8" />
                                            <span className="text-xs mt-2">Add Photo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="profilePhoto"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleProfilePhotoChange}
                                    />
                                </div>
                                {profilePreview && (
                                    <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                                        onClick={removeProfilePhoto}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {form.formState.errors.profilePhoto && (
                            <p className="text-center text-sm font-medium text-[#ea384c]">
                                {form.formState.errors.profilePhoto.message}
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#ea384c]" />
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
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#ea384c]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="admissionNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admission Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2024001" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#ea384c]" />
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
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                {classes.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[#ea384c]" />
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
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal bg-white",
                                                            !field.value && "text-muted-foreground",
                                                            form.formState.errors.dateOfBirth && "border-[#ea384c] focus-visible:ring-[#ea384c]"
                                                        )}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setDatePickerOpen(true);
                                                        }}
                                                        type="button"
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP")
                                                        ) : (
                                                            <span>Select date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={handleDateSelect}
                                                    disabled={(date) => {
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        return date > today;
                                                    }}
                                                    initialFocus
                                                    className="border rounded-md shadow"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage className="text-[#ea384c]" />
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
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[#ea384c]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Guardian Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="guardianName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guardian Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jane Doe" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-[#ea384c]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianRelation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relation to Student</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mother" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-[#ea384c]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianContact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="+1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-[#ea384c]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="guardian@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#ea384c]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St, City, Country" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-[#ea384c]" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Student"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
