
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
	LucideIcon,
	Home,
	Users,
	Calendar,
	BookOpen,
	Settings,
	LogOut,
	Wallet,
	MessageSquare,
	Menu,
	Bus,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
	icon: LucideIcon;
	label: string;
	to: string;
	isActive: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => (
	<Link
		to={to}
		className={cn(
			"flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
			isActive
				? "bg-primary text-primary-foreground"
				: "text-muted-foreground hover:bg-accent"
		)}>
		<Icon size={20} />
		<span className="font-medium">{label}</span>
	</Link>
);

const navItems = [
	{ icon: Home, label: "Dashboard", path: "/" },
	{ icon: Users, label: "Students", path: "/students" },
	{ icon: Users, label: "Staff", path: "/staff" },
	{ icon: Calendar, label: "Calendar", path: "/calendar" },
	{ icon: MessageSquare, label: "Communication", path: "/communication" },
	{ icon: Wallet, label: "Finance", path: "/finance" },
	{ icon: BookOpen, label: "Academics", path: "/academics" },
	{ icon: Bus, label: "Transport", path: "/transport" },
	{ icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
	const location = useLocation();

	const renderNavContent = () => (
		<>
			<div className="flex items-center space-x-3 px-4">
				<div className="w-8 h-8 bg-primary rounded-lg"></div>
				<h1 className="text-xl font-bold">EduConnect</h1>
			</div>

			<nav className="space-y-1 mt-6">
				{navItems.map((item) => (
					<NavItem
						key={item.path}
						icon={item.icon}
						label={item.label}
						to={item.path}
						isActive={location.pathname === item.path}
					/>
				))}
			</nav>

			<div className="pt-6 mt-6 border-t px-4">
				<Button
					variant="ghost"
					className="w-full justify-start space-x-3 text-red-500 hover:text-red-600 hover:bg-red-50">
					<LogOut size={20} />
					<span className="font-medium">Logout</span>
				</Button>
			</div>
		</>
	);

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex w-64 border-r flex-col py-6 space-y-6">
				{renderNavContent()}
			</aside>

			{/* Mobile Sidebar */}
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-4 top-3 z-50">
							<Menu size={20} />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-64 p-6 space-y-6">
						{renderNavContent()}
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
};

export default Sidebar;
