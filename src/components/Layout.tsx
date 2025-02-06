
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export interface LayoutProps {
	children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background">
				<TopBar />
				<div className="flex">
					<div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
						<Sidebar />
					</div>
					<main className="flex-1 overflow-y-auto">
						{children || <Outlet />}
					</main>
				</div>
			</div>
			<Toaster />
			<Sonner />
		</TooltipProvider>
	);
}
