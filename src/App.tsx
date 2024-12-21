import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import StudentsPage from "./pages/students";
import StudentDetails from "./pages/students/[id]";
import CalendarPage from "./pages/calendar";
import StaffPage from "./pages/staff";
import FinancePage from "./pages/finance";
import CommunicationPage from "./pages/communication";
import { useState } from "react";

const App = () => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Layout>
						<Routes>
							<Route path="/" element={<Index />} />
							<Route
								path="/students"
								element={<StudentsPage />}
							/>
							<Route
								path="/students/:id"
								element={<StudentDetails />}
							/>
							<Route
								path="/calendar"
								element={<CalendarPage />}
							/>
							<Route path="/staff" element={<StaffPage />} />
							<Route path="/finance" element={<FinancePage />} />
							<Route
								path="/communication"
								element={<CommunicationPage />}
							/>
						</Routes>
					</Layout>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
};

export default App;
