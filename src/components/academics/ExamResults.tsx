
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
	id: string;
	name: string;
	marks: number;
	grade: string;
	position: number;
}

interface ExamResultsProps {
	examType: "opener" | "midterm" | "endterm";
}

const mockStudents: Student[] = [
	{
		id: "1",
		name: "John Doe",
		marks: 85,
		grade: "A",
		position: 1,
	},
	{
		id: "2",
		name: "Jane Smith",
		marks: 78,
		grade: "B+",
		position: 2,
	},
	{
		id: "3",
		name: "Michael Johnson",
		marks: 72,
		grade: "B",
		position: 3,
	},
];

const ExamResults = ({ examType }: ExamResultsProps) => {
	const examTitles = {
		opener: "Opener Exam",
		midterm: "Mid Term Exam",
		endterm: "End Term Exam",
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{examTitles[examType]} Results</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex gap-4">
						<Select defaultValue="all">
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select class" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Classes</SelectItem>
								<SelectItem value="form1">Form 1</SelectItem>
								<SelectItem value="form2">Form 2</SelectItem>
								<SelectItem value="form3">Form 3</SelectItem>
								<SelectItem value="form4">Form 4</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Position</TableHead>
								<TableHead>Student Name</TableHead>
								<TableHead>Marks (%)</TableHead>
								<TableHead>Grade</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockStudents.map((student) => (
								<TableRow key={student.id}>
									<TableCell>{student.position}</TableCell>
									<TableCell>{student.name}</TableCell>
									<TableCell>{student.marks}</TableCell>
									<TableCell>{student.grade}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default ExamResults;
