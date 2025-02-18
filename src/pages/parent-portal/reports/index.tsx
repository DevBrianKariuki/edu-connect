
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
import { FileText, Download, FileBarChart } from "lucide-react";

// Dummy data for development
const reports = [
    {
        id: 1,
        title: "End of Term Report - Term 1",
        type: "Academic Report",
        date: "2024-03-15",
        size: "2.4 MB",
    },
    {
        id: 2,
        title: "Mid-Term Progress Report",
        type: "Progress Report",
        date: "2024-02-01",
        size: "1.8 MB",
    },
    {
        id: 3,
        title: "Co-curricular Activities Report",
        type: "Activity Report",
        date: "2024-01-15",
        size: "1.2 MB",
    },
];

const ReportsPage = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <FileBarChart className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Academic Reports</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Reports</CardTitle>
                    <CardDescription>
                        Access and download your academic reports
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {report.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>{report.size}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2">
                                            <Download className="h-4 w-4" />
                                            Download
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

export default ReportsPage;
