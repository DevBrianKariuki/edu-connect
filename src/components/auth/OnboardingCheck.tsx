
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const { state } = useAuth();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!state.user?.id) return;

            try {
                const userDoc = await getDoc(doc(db, "users", state.user.id));
                const userData = userDoc.data();

                if (!userData?.onboardingCompleted && state.user.role === "admin") {
                    navigate("/onboarding");
                }
            } catch (error) {
                console.error("Error checking onboarding status:", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkOnboardingStatus();
    }, [state.user, navigate]);

    if (isChecking) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
};
