import React, { useState } from "react";
import {
	Bell,
	Search,
	X,
	User,
	Settings,
	LogOut,
	ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const notifications = [
	{
		id: 1,
		title: "New Message",
		description: "You have a new message from John Doe",
		time: "2 min ago",
	},
	{
		id: 2,
		title: "Assignment Due",
		description: "Math homework is due tomorrow",
		time: "1 hour ago",
	},
	{
		id: 3,
		title: "Meeting Reminder",
		description: "Parent-Teacher meeting at 3 PM",
		time: "2 hours ago",
	},
];

const TopBar = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="flex w-full items-center gap-4">
					<Link to="/" className="flex items-center space-x-2">
						<span className="font-bold text-xl">EduConnect</span>
					</Link>
					<div
						className={cn(
							"flex-1 ml-auto transition-all duration-200 md:block",
							isSearchOpen ? "block" : "hidden"
						)}>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search..."
								className="pl-8 w-full md:w-[300px] h-9"
							/>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsSearchOpen(!isSearchOpen)}>
						{isSearchOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Search className="h-5 w-5" />
						)}
					</Button>

					{/* Notifications Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="relative">
								<Bell className="h-5 w-5" />
								<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{notifications.map((notification) => (
								<DropdownMenuItem
									key={notification.id}
									className="flex flex-col items-start gap-1 p-4">
									<div className="font-medium">
										{notification.title}
									</div>
									<div className="text-sm text-muted-foreground">
										{notification.description}
									</div>
									<div className="text-xs text-muted-foreground">
										{notification.time}
									</div>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem className="w-full text-center">
								<Link
									to="/notifications"
									className="w-full text-center text-primary">
									View all notifications
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Profile Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-2 px-2">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src="/avatars/admin.png"
										alt="Admin"
									/>
									<AvatarFallback>AD</AvatarFallback>
								</Avatar>
								<span className="hidden md:inline-flex">
									Admin
								</span>
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-600">
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
