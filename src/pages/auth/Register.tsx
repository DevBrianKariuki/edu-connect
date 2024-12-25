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
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	EyeOff,
	Mail,
	Loader2,
} from "lucide-react";
import { resendVerificationEmail } from "@/lib/firebase/auth";

// Password validation function
const isStrongPassword = (password: string) => {
	let strength = 0;
	if (password.length >= 8) strength += 20;
	if (/\d/.test(password)) strength += 20;
	if (/[a-z]/.test(password)) strength += 20;
	if (/[A-Z]/.test(password)) strength += 20;
	if (/[^A-Za-z0-9]/.test(password)) strength += 20;
	return strength >= 60; // Requires at least "Good" strength
};

const registerSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.refine(isStrongPassword, {
				message:
					"Password must include uppercase, lowercase, numbers, and special characters",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const navigate = useNavigate();
	const { signup } = useAuth();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [verificationSent, setVerificationSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [resendingEmail, setResendingEmail] = useState(false);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			setIsLoading(true);
			setError(null);
			await signup({
				email: data.email,
				password: data.password,
				name: data.name,
			});
			setVerificationSent(true);
			toast({
				title: "Account Created Successfully!",
				description: "Please check your email to verify your account.",
				duration: 5000,
				className: "bg-green-50 border-green-200",
				action: (
					<div className="flex items-center gap-2 text-green-600">
						<CheckCircle2 className="h-4 w-4" />
						<span>Success</span>
					</div>
				),
			});
		} catch (error: any) {
			setError(error.message || "Failed to create account");
			toast({
				title: "Registration Failed",
				description: error.message || "Failed to create account",
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
			console.error("Registration failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendEmail = async () => {
		try {
			setResendingEmail(true);
			await resendVerificationEmail();
			toast({
				title: "Verification Email Sent",
				description:
					"Please check your inbox for the verification link.",
				duration: 5000,
				className: "bg-green-50 border-green-200",
				action: (
					<div className="flex items-center gap-2 text-green-600">
						<Mail className="h-4 w-4" />
						<span>Sent</span>
					</div>
				),
			});
		} catch (error: any) {
			toast({
				title: "Failed to Resend Email",
				description: error.message || "Please try again later",
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
		} finally {
			setResendingEmail(false);
		}
	};

	if (verificationSent) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-[400px]">
					<CardHeader>
						<div className="flex items-center gap-2 mb-2">
							<CheckCircle2 className="h-5 w-5 text-green-500" />
							<CardTitle>Verify Your Email</CardTitle>
						</div>
						<CardDescription>
							We've sent a verification link to your email
							address. Please check your inbox and verify your
							email to continue.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert className="bg-green-50 border-green-200 text-green-800">
							<AlertTitle className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4" />
								Registration Successful
							</AlertTitle>
							<AlertDescription>
								Your account has been created. Please verify
								your email to continue.
							</AlertDescription>
						</Alert>
						<div className="space-y-2">
							<Button
								className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
								onClick={() => navigate("/auth/login")}>
								<span>Go to Login</span>
							</Button>
							<Button
								variant="outline"
								className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10"
								onClick={handleResendEmail}
								disabled={resendingEmail}>
								{resendingEmail ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>
											Sending verification email...
										</span>
									</>
								) : (
									<>
										<Mail className="h-4 w-4" />
										<span>Resend Verification Email</span>
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
					<CardDescription>
						Sign up to get started with EduConnect
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your full name"
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your email"
												type="email"
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
													placeholder="Create a password"
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
										<PasswordStrengthIndicator
											password={field.value}
										/>
										<FormMessage className="text-red-500" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="Confirm your password"
													type={
														showConfirmPassword
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
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													tabIndex={-1}>
													{showConfirmPassword ? (
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
										<span>Creating your account...</span>
									</>
								) : (
									<span>Sign Up</span>
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						Already have an account?{" "}
						<Button
							variant="link"
							className="px-2 font-semibold text-primary hover:text-primary/80 hover:underline"
							onClick={() => navigate("/auth/login")}>
							Sign in
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
