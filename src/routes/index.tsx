import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import AdminVerification from "@/components/auth/AdminVerification";
import DashboardPage from "@/pages/dashboard";
import StudentsPage from "@/pages/students";
import StudentDetails from "@/pages/students/[id]";
import TeachersPage from "@/pages/teachers";
import CalendarPage from "@/pages/calendar";
import FinancePage from "@/pages/finance";
import NotFoundPage from "@/pages/404";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { state } = useAuth();
	const navigate = useNavigate();

	if (!state.isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
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

	if (!state.user?.adminVerified) {
		return <AdminVerification />;
	}

	return <>{children}</>;
};

// Public Route wrapper component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const { state } = useAuth();
	const navigate = useNavigate();

	if (state.isAuthenticated && state.user?.emailVerified) {
		return <Navigate to="/dashboard" replace />;
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
						path: "register",
						element: (
							<PublicRoute>
								<RegisterPage />
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
				],
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);
