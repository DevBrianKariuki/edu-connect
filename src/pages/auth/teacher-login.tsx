
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
    staffId: z.string().min(1, "Staff ID is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function TeacherLoginPage() {
    const navigate = useNavigate();
    const { teacherLogin } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            staffId: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            await teacherLogin({
                staffId: data.staffId,
                password: data.password,
            });
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
                duration: 5000,
                className: "bg-green-50 border-green-200",
                action: (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Success</span>
                    </div>
                ),
            });
            navigate("/teacher");
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Failed to login",
                variant: "destructive",
                duration: 5000,
                className: "bg-red-50 border-red-200 text-red-900",
                action: (
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Error</span>
                    </div>
                ),
            });
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Teacher Portal Login</CardTitle>
                    <CardDescription>
                        Sign in using your staff ID and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4 bg-muted">
                        <AlertDescription>
                            Demo Credentials:<br />
                            Staff ID: TCH001<br />
                            Password: teacher123
                        </AlertDescription>
                    </Alert>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4">
                            <FormField
                                control={form.control}
                                name="staffId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Staff ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your staff ID"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    tabIndex={-1}>
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="link"
                        className="text-primary hover:text-primary/80"
                        onClick={() => navigate("/auth/forgot-password")}>
                        Forgot your password?
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
