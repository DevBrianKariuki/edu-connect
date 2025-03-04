import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import Layout from "@/components/Layout";
import ParentLayout from "@/components/ParentLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/Register";
import ParentLoginPage from "@/pages/auth/parent-login";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import AdminVerification from "@/components/auth/AdminVerification";
import DashboardPage from "@/pages/dashboard";
import ParentDashboardPage from "@/pages/parent-portal/dashboard";
import StudentsPage from "@/pages/students";
import StudentDetails from "@/pages/students/[id]";
import TeachersPage from "@/pages/teachers";
import TeacherDetailsPage from "@/pages/teachers/[id]";
import TeacherSchedulePage from "@/pages/teachers/schedule";
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
import AttendancePage from "@/pages/parent-portal/attendance";
import MessagesPage from "@/pages/parent-portal/messages";
import ReportsPage from "@/pages/parent-portal/reports";
import FeesPage from "@/pages/parent-portal/fees";
import ParentCalendarPage from "@/pages/parent-portal/calendar";
import ParentSettingsPage from "@/pages/parent-portal/settings";
import TransportTrackingPage from "@/pages/parent-portal/transport";
import TimetablePage from "@/pages/parent-portal/timetable";
import TimetablePageAdmin from "@/pages/timetable";
import ClassDetailsPage from "@/pages/classes/[id]";
import { 
    Home,
    Users,
    Calendar,
    MessageSquare,
    Wallet,
    BookOpen,
    Bus,
    Settings
} from "lucide-react";
import TeacherLoginPage from "@/pages/auth/teacher-login";
import TeacherDashboardPage from "@/pages/teachers/dashboard";
import TeacherStudentsPage from "@/pages/teachers/students";
import TeacherSubjectsPage from "@/pages/teachers/subjects";
import TeacherGradesPage from "@/pages/teachers/grades";
import TeacherAttendancePage from "@/pages/teachers/attendance";
import TeacherMessagesPage from "@/pages/teachers/messages";
import TeacherSettingsPage from "@/pages/teachers/settings";

const ProtectedRoute = ({ children, requireParent = false }: { children: React.ReactNode, requireParent?: boolean }) => {
    const { state } = useAuth();
    const navigate = useNavigate();

    if (!state.isAuthenticated) {
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

    if (state.user?.role === "admin" && !state.user?.adminVerified && !window.location.pathname.includes('/auth')) {
        return <AdminVerification />;
    }

    if (requireParent && state.user?.role !== "parent") {
        return <Navigate to="/dashboard" replace />;
    }

    if (!requireParent && state.user?.role === "parent") {
        return <Navigate to="/parent" replace />;
    }

    return <>{children}</>;
};

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

const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: Users, label: "Staff", path: "/staff" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: MessageSquare, label: "Communication", path: "/communication" },
    { icon: Wallet, label: "Finance", path: "/finance" },
    { icon: BookOpen, label: "Academics", path: "/academics" },
    { icon: Bus, label: "Transport", path: "/transport" },
    { icon: Calendar, label: "Timetable", path: "/timetable" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

const router = createBrowserRouter([
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
                        path: "register",
                        element: (
                            <PublicRoute>
                                <RegisterPage />
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
                    {
                        path: "teacher-login",
                        element: (
                            <PublicRoute>
                                <TeacherLoginPage />
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
                                path: "classes/:id",
                                element: <ClassDetailsPage />,
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
                                children: [
                                    {
                                        index: true,
                                        element: <TeachersPage />,
                                    },
                                    {
                                        path: ":id",
                                        element: <TeacherDetailsPage />,
                                    },
                                    {
                                        path: "schedule",
                                        element: <TeacherSchedulePage />,
                                    },
                                ],
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
                            {
                                path: "timetable",
                                element: <TimetablePageAdmin />,
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
                        path: "calendar",
                        element: <ParentCalendarPage />,
                    },
                    {
                        path: "settings",
                        element: <ParentSettingsPage />,
                    },
                    {
                        path: "academics",
                        element: <AcademicProgressPage />,
                    },
                    {
                        path: "attendance",
                        element: <AttendancePage />,
                    },
                    {
                        path: "messages",
                        element: <MessagesPage />,
                    },
                    {
                        path: "fees",
                        element: <FeesPage />,
                    },
                    {
                        path: "transport",
                        element: <TransportTrackingPage />,
                    },
                    {
                        path: "timetable",
                        element: <TimetablePage />,
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
                path: "/teacher",
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
                                element: <TeacherDashboardPage />,
                            },
                            {
                                path: "schedule",
                                element: <TeacherSchedulePage />,
                            },
                            {
                                path: "students",
                                element: <TeacherStudentsPage />,
                            },
                            {
                                path: "subjects",
                                element: <TeacherSubjectsPage />,
                            },
                            {
                                path: "attendance",
                                element: <TeacherAttendancePage />,
                            },
                            {
                                path: "grades",
                                element: <TeacherGradesPage />,
                            },
                            {
                                path: "messages",
                                element: <TeacherMessagesPage />,
                            },
                            {
                                path: "settings",
                                element: <TeacherSettingsPage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

export { router, navItems };
