
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/AuthContext";
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building2, MapPin, Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const onboardingSchema = z.object({
    schoolName: z.string().min(2, "School name must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    academicYear: z.string(),
    terms: z.array(
        z.object({
            name: z.string(),
            startDate: z.date(),
            endDate: z.date(),
        })
    ).length(3, "Must define all three terms"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { state } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    const form = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            schoolName: "",
            location: "",
            academicYear: academicYear,
            terms: [
                { name: "Term 1", startDate: new Date(), endDate: new Date() },
                { name: "Term 2", startDate: new Date(), endDate: new Date() },
                { name: "Term 3", startDate: new Date(), endDate: new Date() },
            ],
        },
    });

    const onSubmit = async (data: OnboardingData) => {
        if (!state.user?.id) return;

        try {
            setIsLoading(true);
            
            // Save school details
            await setDoc(doc(db, "schools", state.user.id), {
                name: data.schoolName,
                location: data.location,
                academicYear: data.academicYear,
                terms: data.terms,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Update user's onboarding status
            await setDoc(
                doc(db, "users", state.user.id),
                {
                    onboardingCompleted: true,
                    updatedAt: new Date(),
                },
                { merge: true }
            );

            toast({
                title: "Setup Complete!",
                description: "Your school has been successfully configured.",
                className: "bg-green-50 border-green-200",
            });

            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save school details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-2xl">School Setup</CardTitle>
                    <CardDescription>
                        Configure your school's basic information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6">
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="schoolName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>School Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        className="pl-9"
                                                        placeholder="Enter school name"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        className="pl-9"
                                                        placeholder="Enter school location"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="academicYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select academic year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={`${
                                                            currentYear - 1
                                                        }-${currentYear}`}>
                                                        {currentYear - 1}-
                                                        {currentYear}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={`${currentYear}-${
                                                            currentYear + 1
                                                        }`}>
                                                        {currentYear}-
                                                        {currentYear + 1}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">
                                    Academic Terms
                                </h3>
                                <div className="grid gap-6">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={index}
                                            className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name={`terms.${index}.startDate`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Term {index + 1} Start
                                                            Date
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value &&
                                                                                "text-muted-foreground"
                                                                        )}>
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                "PPP"
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pick
                                                                                a
                                                                                date
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
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
                                                name={`terms.${index}.endDate`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Term {index + 1} End
                                                            Date
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value &&
                                                                                "text-muted-foreground"
                                                                        )}>
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                "PPP"
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pick
                                                                                a
                                                                                date
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Complete Setup"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
