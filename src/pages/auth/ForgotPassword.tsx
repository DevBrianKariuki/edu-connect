import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Loader2,
	Mail,
} from "lucide-react";
import { resetPassword } from "@/lib/firebase/auth";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [resetSent, setResetSent] = useState(false);

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			setIsLoading(true);
			await resetPassword(data.email);
			setResetSent(true);
			toast({
				title: "Reset Email Sent",
				description: "Please check your email for the reset link.",
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
			toast({
				title: "Failed to Send Reset Email",
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
			console.error("Reset password failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (resetSent) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-[400px]">
					<CardHeader>
						<div className="flex items-center gap-2 mb-2">
							<Mail className="h-5 w-5 text-green-500" />
							<CardTitle>Check Your Email</CardTitle>
						</div>
						<CardDescription>
							We've sent a password reset link to your email
							address. Please check your inbox and follow the
							instructions to reset your password.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert className="bg-green-50 border-green-200 text-green-800">
							<AlertTitle className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4" />
								Reset Email Sent
							</AlertTitle>
							<AlertDescription>
								If you don't see the email, please check your
								spam folder.
							</AlertDescription>
						</Alert>
						<div className="space-y-2">
							<Button
								className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
								onClick={() => navigate("/auth/login")}>
								<ArrowLeft className="h-4 w-4" />
								<span>Back to Login</span>
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
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>
						Enter your email address and we'll send you a link to
						reset your password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4">
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
							<Button
								type="submit"
								className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
								disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Sending reset link...</span>
									</>
								) : (
									<span>Send Reset Link</span>
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						Remember your password?{" "}
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
