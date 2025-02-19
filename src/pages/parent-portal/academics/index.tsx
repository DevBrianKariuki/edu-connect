
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Dummy data for development
const academicYears = ["2024", "2023", "2022"];
const terms = ["Term 1", "Term 2", "Term 3"];

const reports = [
    {
        id: 1,
        title: "End of Term Report - Term 1",
        type: "Academic Report",
        date: "2024-03-15",
        academicYear: "2024",
        term: "Term 1",
    },
    {
        id: 2,
        title: "Mid-Term Progress Report",
        type: "Progress Report",
        date: "2024-02-01",
        academicYear: "2024",
        term: "Term 1",
    },
];

const AcademicsPage = () => {
    const [selectedYear, setSelectedYear] = React.useState(academicYears[0]);
    const [selectedTerm, setSelectedTerm] = React.useState(terms[0]);

    const filteredReports = reports.filter(
        (report) =>
            report.academicYear === selectedYear && report.term === selectedTerm
    );

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Academic Reports</h1>
            </div>

            <div className="flex gap-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Term" />
                    </SelectTrigger>
                    <SelectContent>
                        {terms.map((term) => (
                            <SelectItem key={term} value={term}>
                                {term}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Reports</CardTitle>
                    <CardDescription>
                        View your academic reports for {selectedYear} - {selectedTerm}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {report.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            View Report
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AcademicsPage;
