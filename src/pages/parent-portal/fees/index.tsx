
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
import { Receipt, CreditCard, FileText, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dummy data for development
const feesSummary = {
    totalFees: 50000,
    paid: 35000,
    balance: 15000,
    dueDate: "2024-04-30",
};

const transactions = [
    {
        id: 1,
        date: "2024-03-01",
        description: "Term 1 Fees Payment",
        amount: 25000,
        status: "completed",
        reference: "TRX123456",
    },
    {
        id: 2,
        date: "2024-02-15",
        description: "Library Fees",
        amount: 5000,
        status: "completed",
        reference: "TRX123457",
    },
    {
        id: 3,
        date: "2024-02-01",
        description: "Activity Fees",
        amount: 5000,
        status: "completed",
        reference: "TRX123458",
    },
];

const FeesPage = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Receipt className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Fees & Payments</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Fees
                                </p>
                                <p className="text-2xl font-bold">
                                    KES {feesSummary.totalFees.toLocaleString()}
                                </p>
                            </div>
                            <Receipt className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Amount Paid
                                </p>
                                <p className="text-2xl font-bold">
                                    KES {feesSummary.paid.toLocaleString()}
                                </p>
                            </div>
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Balance
                                </p>
                                <p className="text-2xl font-bold text-destructive">
                                    KES {feesSummary.balance.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Due by {feesSummary.dueDate}
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-destructive" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                        View your recent fee payments and transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell className="font-medium">
                                        {transaction.description}
                                    </TableCell>
                                    <TableCell>
                                        KES{" "}
                                        {transaction.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{transaction.reference}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2">
                                            <ArrowUpRight className="h-4 w-4" />
                                            View Receipt
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

export default FeesPage;
