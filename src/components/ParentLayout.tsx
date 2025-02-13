
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopBar from "./TopBar";
import ParentSidebar from "./ParentSidebar";

export interface LayoutProps {
	children?: React.ReactNode;
}

export default function ParentLayout({ children }: LayoutProps) {
	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background">
				<TopBar />
				<div className="flex">
					<div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
						<ParentSidebar />
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
