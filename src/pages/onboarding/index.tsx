
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
import { Building2, MapPin } from "lucide-react";

const onboardingSchema = z.object({
    schoolName: z.string().min(2, "School name must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    phone: z.string().min(6, "Phone number must be at least 6 characters"),
    email: z.string().email("Please enter a valid email address"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { state } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            schoolName: "",
            location: "",
            phone: "",
            email: "",
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
                phone: data.phone,
                email: data.email,
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
            <Card className="w-full max-w-lg">
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
                            className="space-y-6"
                        >
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="Enter contact number"
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
                                        <FormLabel>School Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Enter school email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                Complete Setup
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
