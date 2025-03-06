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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ImagePlus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClassData {
    id: string;
    name: string;
    capacity: number;
    teacher: string;
    students: number;
}

interface StudentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<boolean>;
    classes: ClassData[];
    defaultClassId?: string;
}

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

const formSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),
    admissionNumber: z.string().min(1, "Admission number is required"),
    class: z.string().min(1, "Class is required"),
    dateOfBirth: z.date({
        required_error: "Date of birth is required",
    }),
    gender: z.string().min(1, "Gender is required"),
    guardianName: z.string().min(1, "Guardian name is required"),
    guardianRelation: z.string().min(1, "Relation is required"),
    guardianContact: z.string()
        .min(1, "Contact is required")
        .refine(validateKenyanPhone, {
            message: "Please enter a valid Kenyan phone number (+254XXXXXXXXX or 07XXXXXXXX)"
        }),
    guardianEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    profilePhoto: z
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

const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    classes,
    defaultClassId,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [savedFormState, setSavedFormState] = useState<any>(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            admissionNumber: "",
            class: defaultClassId || "",
            dateOfBirth: undefined,
            gender: "",
            guardianName: "",
            guardianRelation: "",
            guardianContact: "",
            guardianEmail: "",
            address: "",
            profilePhoto: undefined,
        },
    });

    useEffect(() => {
        if (defaultClassId) {
            form.setValue("class", defaultClassId);
        }
    }, [defaultClassId, form]);

    useEffect(() => {
        if (open && savedFormState) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            Object.entries(savedFormState).forEach(([key, value]) => {
                if (key === 'profilePhoto') return;
                
                if (key === 'dateOfBirth' && value) {
                    form.setValue(key as any, new Date(value as string));
                } else {
                    form.setValue(key as any, value);
                }
            });
            
            if (savedFormState.previewUrl) {
                setPreviewUrl(savedFormState.previewUrl);
            }
            
            if (savedFormState.profilePhoto instanceof File) {
                form.setValue('profilePhoto', savedFormState.profilePhoto);
            }
        }
    }, [open, form, savedFormState]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);

    const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        setFormSubmitError(null);

        try {
            const formattedValues = {
                ...values,
                guardianContact: formatToKenyanPhone(values.guardianContact),
            };

            const success = await onSubmit(formattedValues);
            if (success) {
                form.reset();
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                setSavedFormState(null);
                onOpenChange(false);
            }
        } catch (error: any) {
            setFormSubmitError(error.message || "An error occurred while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            form.setError("profilePhoto", { 
                message: "Only .jpg, .jpeg, .png and .webp files are accepted" 
            });
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            form.setError("profilePhoto", { 
                message: "File size must be less than 5MB" 
            });
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange(file);
    };

    const removeProfilePhoto = () => {
        form.setValue("profilePhoto", undefined);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen) {
                    const currentValues = form.getValues();
                    setSavedFormState({
                        ...currentValues,
                        previewUrl: previewUrl
                    });
                }
                onOpenChange(newOpen);
            }}
        >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <FormField
                                control={form.control}
                                name="profilePhoto"
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormLabel className="cursor-pointer">
                                            {previewUrl ? (
                                                <div className="relative">
                                                    <Avatar className="w-24 h-24">
                                                        <AvatarImage src={previewUrl} alt="Preview" />
                                                        <AvatarFallback>
                                                            {form.getValues().firstName?.[0]}{form.getValues().lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <button 
                                                        type="button"
                                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeProfilePhoto();
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

                        <div className="grid grid-cols-2 gap-4">
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

                        <FormField
                            control={form.control}
                            name="admissionNumber"
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
                            name="class"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {classes.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                    No classes available
                                                </SelectItem>
                                            ) : (
                                                classes.map((classData) => (
                                                    <SelectItem 
                                                        key={classData.id} 
                                                        value={classData.id}
                                                    >
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

                        <div className="grid grid-cols-2 gap-4">
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
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="guardianName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guardian Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="guardianRelation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relation</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relation" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="parent">Parent</SelectItem>
                                                <SelectItem value="guardian">Guardian</SelectItem>
                                                <SelectItem value="sibling">Sibling</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="guardianContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                placeholder="+254 7XX XXX XXX"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="guardianEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
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

                        {formSubmitError && (
                            <div className="text-destructive text-sm">{formSubmitError}</div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
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
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Add Student"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default StudentFormDialog;
