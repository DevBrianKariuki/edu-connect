import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import Layout from "@/components/Layout";
import ParentLayout from "@/components/ParentLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoginPage from "@/pages/auth/login";
import ParentLoginPage from "@/pages/auth/parent-login";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import AdminVerification from "@/components/auth/AdminVerification";
import DashboardPage from "@/pages/dashboard";
import ParentDashboardPage from "@/pages/parent-portal/dashboard";
import StudentsPage from "@/pages/students";
import StudentDetails from "@/pages/students/[id]";
import TeachersPage from "@/pages/teachers";
import CalendarPage from "@/pages/calendar";
import FinancePage from "@/pages/finance";
import NotFoundPage from "@/pages/404";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AcademicsPage from "@/pages/academics";
import CommunicationPage from "@/pages/communication";
import StaffPage from "@/pages/staff";
import SettingsPage from "@/pages/settings";
import TransportPage from "@/pages/transport";
import OnboardingPage from "@/pages/onboarding";
import OnboardingCheck from "@/components/auth/OnboardingCheck";
import { Outlet } from "react-router-dom";
import AcademicProgressPage from "@/pages/parent-portal/academics";

// Protected Route wrapper component
const ProtectedRoute = ({ children, requireParent = false }: { children: React.ReactNode, requireParent?: boolean }) => {
    const { state } = useAuth();
    const navigate = useNavigate();

    if (!state.isAuthenticated) {
        // Redirect to appropriate login page based on the URL
        const isParentRoute = window.location.pathname.startsWith("/parent");
        return (
            <Navigate
                to={isParentRoute ? "/auth/parent-login" : "/auth/login"}
                replace
            />
        );
    }

    if (!state.user?.emailVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">
                        Email Verification Required
                    </h1>
                    <p className="text-muted-foreground">
                        Please verify your email address before accessing this
                        page. Check your inbox for the verification link.
                    </p>
                    <Button onClick={() => navigate("/auth/login")}>
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    // Only show admin verification if user is not already verified and is an admin
    if (!state.user?.adminVerified && state.user?.role === "admin") {
        return <AdminVerification />;
    }

    // Handle parent-specific route protection
    if (requireParent && state.user?.role !== "parent") {
        return <Navigate to="/dashboard" replace />;
    }

    // Prevent non-parent users from accessing parent routes
    if (!requireParent && state.user?.role === "parent") {
        return <Navigate to="/parent" replace />;
    }

    return <>{children}</>;
};

// Public Route wrapper component (redirects to appropriate dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { state } = useAuth();

    if (state.isAuthenticated && state.user?.emailVerified) {
        return state.user.role === "parent" ? (
            <Navigate to="/parent" replace />
        ) : (
            <Navigate to="/dashboard" replace />
        );
    }

    return <>{children}</>;
};

export const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: "__/auth/action",
                element: <ResetPasswordPage />,
            },
            {
                path: "auth",
                children: [
                    {
                        path: "login",
                        element: (
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        ),
                    },
                    {
                        path: "parent-login",
                        element: (
                            <PublicRoute>
                                <ParentLoginPage />
                            </PublicRoute>
                        ),
                    },
                    {
                        path: "forgot-password",
                        element: (
                            <PublicRoute>
                                <ForgotPasswordPage />
                            </PublicRoute>
                        ),
                    },
                ],
            },
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        element: <OnboardingCheck><Outlet /></OnboardingCheck>,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/dashboard" replace />,
                            },
                            {
                                path: "dashboard",
                                element: <DashboardPage />,
                            },
                            {
                                path: "students",
                                children: [
                                    {
                                        index: true,
                                        element: <StudentsPage />,
                                    },
                                    {
                                        path: ":id",
                                        element: <StudentDetails />,
                                    },
                                ],
                            },
                            {
                                path: "staff",
                                element: <StaffPage />,
                            },
                            {
                                path: "communication",
                                element: <CommunicationPage />,
                            },
                            {
                                path: "academics",
                                element: <AcademicsPage />,
                            },
                            {
                                path: "teachers",
                                element: <TeachersPage />,
                            },
                            {
                                path: "calendar",
                                element: <CalendarPage />,
                            },
                            {
                                path: "finance",
                                element: <FinancePage />,
                            },
                            {
                                path: "settings",
                                element: <SettingsPage />,
                            },
                            {
                                path: "transport",
                                element: <TransportPage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "parent",
                element: (
                    <ProtectedRoute requireParent={true}>
                        <ParentLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <ParentDashboardPage />,
                    },
                    {
                        path: "academics",
                        element: <AcademicProgressPage />,
                    },
                    {
                        path: "attendance",
                        element: <div>Attendance</div>,
                    },
                    {
                        path: "calendar",
                        element: <CalendarPage />,
                    },
                    {
                        path: "messages",
                        element: <div>Messages</div>,
                    },
                    {
                        path: "reports",
                        element: <div>Reports</div>,
                    },
                    {
                        path: "fees",
                        element: <div>Fees</div>,
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                ],
            },
            {
                path: "onboarding",
                element: (
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);
