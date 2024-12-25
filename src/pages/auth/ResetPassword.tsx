import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
	confirmPasswordReset,
	verifyPasswordResetCode,
} from "@/lib/firebase/auth";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";

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

const resetPasswordSchema = z
	.object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [isVerifying, setIsVerifying] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mode = searchParams.get("mode");
	const oobCode = searchParams.get("oobCode");

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		const verifyCode = async () => {
			if (!oobCode || mode !== "resetPassword") {
				setError("Invalid or expired reset link");
				setIsVerifying(false);
				return;
			}

			try {
				await verifyPasswordResetCode(oobCode);
				setIsVerifying(false);
			} catch (error: any) {
				setError(error.message || "Invalid or expired reset link");
				setIsVerifying(false);
			}
		};

		verifyCode();
	}, [oobCode, mode]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (!oobCode || mode !== "resetPassword") {
			setError("Invalid or expired reset link");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			await confirmPasswordReset(oobCode, data.password);
			toast({
				title: "Password Reset Successful",
				description:
					"Your password has been reset successfully. You can now login with your new password.",
				duration: 5000,
				className: "bg-green-50 border-green-200",
				action: (
					<div className="flex items-center gap-2 text-green-600">
						<CheckCircle2 className="h-4 w-4" />
						<span>Success</span>
					</div>
				),
			});
			navigate("/auth/login");
		} catch (error: any) {
			setError(error.message || "Failed to reset password");
			toast({
				title: "Password Reset Failed",
				description:
					error.message ||
					"Failed to reset password. Please try again or request a new reset link.",
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
			setIsLoading(false);
		}
	};

	if (isVerifying) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-[400px]">
					<CardHeader>
						<CardTitle>Verifying Reset Link</CardTitle>
						<CardDescription>
							Please wait while we verify your reset link...
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center py-6">
						<Loader2 className="h-8 w-8 animate-spin" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error && !oobCode) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-[400px]">
					<CardHeader>
						<CardTitle>Invalid Reset Link</CardTitle>
						<CardDescription>
							The password reset link is invalid or has expired.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
						<Button
							className="w-full"
							onClick={() => navigate("/auth/forgot-password")}>
							Request New Reset Link
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Reset Your Password</CardTitle>
					<CardDescription>
						Please enter your new password below.
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
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="Enter new password"
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
										<FormLabel>
											Confirm New Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="Confirm new password"
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
										<span>Resetting password...</span>
									</>
								) : (
									<span>Reset Password</span>
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
