
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
    admissionNumber: z.string().min(1, "Admission number is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function ParentLoginPage() {
    const navigate = useNavigate();
    const { parentLogin } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            admissionNumber: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            await parentLogin({
                admissionNumber: data.admissionNumber,
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
            navigate("/parent");
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
                    <CardTitle>Parent Portal Login</CardTitle>
                    <CardDescription>
                        Sign in using your child's admission number
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4 bg-muted">
                        <AlertDescription>
                            Demo Credentials:<br />
                            Admission Number: STD001<br />
                            Password: parent123
                        </AlertDescription>
                    </Alert>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4">
                            <FormField
                                control={form.control}
                                name="admissionNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admission Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter student admission number"
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
