
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
    const { verifyAdminCode, generateAdminVerificationCode, state, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleResendCode = async () => {
        try {
            setIsLoading(true);
            if (state.user) {
                await generateAdminVerificationCode(state.user);
                toast({
                    title: "Success",
                    description: "A new verification code has been sent to your email.",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to resend verification code",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Admin Verification Required
                    </CardTitle>
                    <CardDescription>
                        Please enter the 6-digit verification code sent to your
                        email address.
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
                        <div className="space-y-2">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Code"
                                )}
                            </Button>
                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={handleResendCode}
                                    disabled={isLoading}>
                                    Resend Code
                                </Button>
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={logout}
                                    disabled={isLoading}>
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
