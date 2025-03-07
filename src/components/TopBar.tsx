
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Bell, BellDot, User, Calendar } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUpcomingEvents, Event } from "@/lib/firebase/events";
import { differenceInDays, format } from "date-fns";

const TopBar = () => {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState<Array<{
        id: number | string;
        title: string;
        description: string;
        time: string;
        type?: string;
    }>>([]);
    
    // Sample notifications - in a real app, this would come from a backend
    const staticNotifications = [
        {
            id: 1,
            title: "New Assignment",
            description: "Math homework due tomorrow",
            time: "10 minutes ago"
        },
        {
            id: 2,
            title: "Grade Posted",
            description: "Your Science test results are available",
            time: "1 hour ago"
        },
        {
            id: 3,
            title: "School Event",
            description: "Annual Sports Day next week",
            time: "2 hours ago"
        }
    ];

    useEffect(() => {
        const fetchEventNotifications = async () => {
            try {
                // Get all upcoming events
                const events = await getUpcomingEvents();
                
                // Check for events occurring in exactly 2 days
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const eventNotifications = events
                    .filter(event => {
                        const daysUntilEvent = differenceInDays(new Date(event.date), today);
                        return daysUntilEvent === 2; // Events exactly 2 days away
                    })
                    .map(event => ({
                        id: event.id,
                        title: "Event Reminder",
                        description: `${event.title} is scheduled in 2 days`,
                        time: format(new Date(), "h:mm a"),
                        type: "event"
                    }));
                
                // Combine static notifications with event notifications
                setNotifications([...eventNotifications, ...staticNotifications]);
            } catch (error) {
                console.error("Error fetching event notifications:", error);
                // If there's an error, still show the static notifications
                setNotifications(staticNotifications);
            }
        };
        
        fetchEventNotifications();
        
        // Refresh event notifications every hour
        const intervalId = setInterval(fetchEventNotifications, 60 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex-1">
                    <a href="/" className="font-bold text-xl">
                        EduConnect
                    </a>
                </div>
                
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                {notifications.some(n => n.type === "event") ? (
                                    <BellDot className="h-[1.2rem] w-[1.2rem]" />
                                ) : (
                                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                                )}
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                    {notifications.length}
                                </Badge>
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 bg-background border shadow-lg">
                            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                                    <div className="font-medium flex items-center gap-2">
                                        {notification.type === "event" && <Calendar className="h-4 w-4" />}
                                        {notification.title}
                                    </div>
                                    <div className="text-sm text-text-secondary">{notification.description}</div>
                                    <div className="text-xs text-text-secondary">{notification.time}</div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-center justify-center text-sm text-primary">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
