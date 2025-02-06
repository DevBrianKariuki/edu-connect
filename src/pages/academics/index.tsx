
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BookOpen, GraduationCap, School } from "lucide-react";
import ExamResults from "@/components/academics/ExamResults";

const AcademicsPage = () => {
	return (
		<div className="p-6 max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Academic Management
					</h1>
					<p className="text-muted-foreground">
						Manage courses, classes, and academic results
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center space-y-0 pb-2">
						<div className="w-full">
							<CardTitle className="text-sm font-medium">
								Total Courses
							</CardTitle>
							<p className="text-3xl font-bold">24</p>
						</div>
						<BookOpen className="h-8 w-8 text-muted-foreground" />
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center space-y-0 pb-2">
						<div className="w-full">
							<CardTitle className="text-sm font-medium">
								Active Classes
							</CardTitle>
							<p className="text-3xl font-bold">12</p>
						</div>
						<School className="h-8 w-8 text-muted-foreground" />
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center space-y-0 pb-2">
						<div className="w-full">
							<CardTitle className="text-sm font-medium">
								Exam Sessions
							</CardTitle>
							<p className="text-3xl font-bold">3</p>
						</div>
						<GraduationCap className="h-8 w-8 text-muted-foreground" />
					</CardHeader>
				</Card>
			</div>

			<Tabs defaultValue="exams" className="space-y-6">
				<TabsList className="bg-muted">
					<TabsTrigger value="exams">Examinations</TabsTrigger>
					<TabsTrigger value="courses">Courses</TabsTrigger>
					<TabsTrigger value="classes">Classes</TabsTrigger>
				</TabsList>

				<TabsContent value="exams" className="space-y-6">
					<ExamResults examType="opener" />
					<ExamResults examType="midterm" />
					<ExamResults examType="endterm" />
				</TabsContent>

				<TabsContent value="courses" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Management</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Course Name</Label>
									<Input placeholder="Enter course name" />
								</div>
								<div className="space-y-2">
									<Label>Subject Area</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select subject area" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="mathematics">
												Mathematics
											</SelectItem>
											<SelectItem value="science">
												Science
											</SelectItem>
											<SelectItem value="languages">
												Languages
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="classes" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Class Management</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Class Name</Label>
									<Input placeholder="Enter class name" />
								</div>
								<div className="space-y-2">
									<Label>Grade Level</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select grade level" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="grade1">
												Grade 1
											</SelectItem>
											<SelectItem value="grade2">
												Grade 2
											</SelectItem>
											<SelectItem value="grade3">
												Grade 3
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AcademicsPage;
