import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AdminVerification() {
	const [code, setCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { verifyAdminCode, logout } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code) {
			toast({
				title: "Error",
				description: "Please enter the verification code",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);
			console.log("Verifying admin code...");
			await verifyAdminCode(code);
			console.log("Verification successful, attempting navigation...");
			toast({
				title: "Success",
				description: "Your account has been verified successfully.",
			});

			// Add a small delay before navigation
			setTimeout(() => {
				console.log("Navigating to dashboard...");
				navigate("/dashboard", { replace: true });
			}, 1000);
		} catch (error: any) {
			console.error("Verification failed:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to verify code",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Admin Verification</CardTitle>
				<CardDescription>
					Please enter the 6-digit verification code sent to the
					admin's email.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Input
							type="text"
							placeholder="Enter 6-digit verification code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							maxLength={6}
							disabled={isLoading}
							className="text-center text-lg tracking-wider"
						/>
					</div>
					<Button
						type="submit"
						className="w-full flex items-center justify-center gap-2"
						disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Verifying...</span>
							</>
						) : (
							<span>Verify Code</span>
						)}
					</Button>
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={logout}>
						Sign Out
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
