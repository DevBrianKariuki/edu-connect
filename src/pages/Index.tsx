import React from "react";
import { Users, BookOpen, Calendar, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({
	icon: Icon,
	label,
	value,
	trend,
	className,
}: {
	icon: any;
	label: string;
	value: string;
	trend?: string;
	className?: string;
}) => (
	<Card
		className={cn(
			"relative overflow-hidden transition-all hover:shadow-lg",
			"border-0 bg-gradient-to-br p-6",
			className
		)}>
		<div className="relative z-10">
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Icon className="text-white" size={20} />
						<p className="text-sm font-medium text-white/80">
							{label}
						</p>
					</div>
					<h3 className="text-2xl font-bold text-white">{value}</h3>
					{trend && (
						<p className="text-sm text-white/80 flex items-center gap-1">
							{trend}
						</p>
					)}
				</div>
			</div>
		</div>
		<div className="absolute right-0 bottom-0 opacity-10">
			<Icon
				size={100}
				className="transform translate-x-1/4 translate-y-1/4"
			/>
		</div>
	</Card>
);

const RecentActivity = () => {
	const activities = [
		{
			id: 1,
			title: "New Assessment Added",
			description: "Mathematics - Grade 4",
			time: "2h ago",
			icon: BookOpen,
		},
		{
			id: 2,
			title: "Parent Meeting Scheduled",
			description: "Grade 6 - Term Review",
			time: "3h ago",
			icon: Calendar,
		},
		{
			id: 3,
			title: "New Student Enrolled",
			description: "Grade 3 - Transfer",
			time: "5h ago",
			icon: Users,
		},
	];

	return (
		<Card className="mt-8 border-0 shadow-lg">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold tracking-tight">
						Recent Activity
					</h2>
					<Button
						variant="ghost"
						className="text-sm text-muted-foreground hover:text-primary">
						View All
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
				<div className="space-y-5">
					{activities.map((activity) => (
						<div
							key={activity.id}
							className="group flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-accent">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
								<activity.icon className="h-6 w-6 text-primary" />
							</div>
							<div className="flex-1 space-y-1">
								<p className="font-medium leading-none">
									{activity.title}
								</p>
								<p className="text-sm text-muted-foreground">
									{activity.description}
								</p>
							</div>
							<div className="ml-auto text-sm text-muted-foreground">
								{activity.time}
							</div>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};

const Index = () => {
	return (
		<div className="container space-y-8 animate-fadeIn py-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back, Admin
					</h1>
					<p className="text-muted-foreground">
						Here's what's happening in your school today
					</p>
				</div>
				<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
					<Plus className="mr-2 h-5 w-5" />
					Add New Student
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<StatCard
					icon={Users}
					label="Total Students"
					value="1,234"
					trend="+12% from last month"
					className="from-blue-600 to-blue-700"
				/>
				<StatCard
					icon={BookOpen}
					label="Active Classes"
					value="32"
					className="from-purple-600 to-purple-700"
				/>
				<StatCard
					icon={Calendar}
					label="Upcoming Events"
					value="8"
					trend="Next: Parent Meeting"
					className="from-emerald-600 to-emerald-700"
				/>
			</div>

			<RecentActivity />
		</div>
	);
};

export default Index;
