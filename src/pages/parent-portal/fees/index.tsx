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
import { Receipt, CreditCard, FileText, ArrowUpRight, Download, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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

const currentTerm = {
    academicYear: "2024",
    term: "Term 1",
    startDate: "January 2024",
    endDate: "April 2024",
};

const feeStructure = {
    tuitionFee: 35000,
    activityFee: 5000,
    libraryFee: 3000,
    transportFee: 7000,
    total: 50000,
};

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
        paymentMethod: "M-PESA",
        balanceAfter: 25000,
    },
    {
        id: 2,
        date: "2024-02-15",
        description: "Library Fees",
        amount: 5000,
        status: "completed",
        reference: "TRX123457",
        paymentMethod: "M-PESA",
        balanceAfter: 20000,
    },
    {
        id: 3,
        date: "2024-02-01",
        description: "Activity Fees",
        amount: 5000,
        status: "completed",
        reference: "TRX123458",
        paymentMethod: "M-PESA",
        balanceAfter: 15000,
    },
];

const FeesPage = () => {
    const { toast } = useToast();
    const [selectedYear, setSelectedYear] = React.useState(academicYears[0]);
    const [selectedTerm, setSelectedTerm] = React.useState(terms[0]);

    const handleMpesaPayment = () => {
        toast({
            title: "M-PESA Payment",
            description: "STK Push has been sent to your phone. Please complete the payment.",
        });
    };

    const handleDownloadFeeStructure = () => {
        toast({
            title: "Download Started",
            description: "The fee structure PDF is being downloaded.",
        });
    };

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Receipt className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Fees & Payments</h1>
            </div>

            {/* Term Selection */}
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

            {/* M-PESA Payment Section - Moved to top */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Quick Payment via M-PESA</h3>
                            <p className="text-sm text-muted-foreground">
                                Pay your fees securely using M-PESA
                            </p>
                        </div>
                        <Button onClick={handleMpesaPayment} className="gap-2">
                            <Phone className="h-4 w-4" />
                            Pay with M-PESA
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Current Term Info */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {selectedYear} - {selectedTerm}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {currentTerm.startDate} - {currentTerm.endDate}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleDownloadFeeStructure}>
                            <Download className="h-4 w-4" />
                            Download Fee Structure
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
                <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                    <CardDescription>Breakdown of fees for current term</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Tuition Fee</TableCell>
                                <TableCell className="text-right">
                                    KES {feeStructure.tuitionFee.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Activity Fee</TableCell>
                                <TableCell className="text-right">
                                    KES {feeStructure.activityFee.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Library Fee</TableCell>
                                <TableCell className="text-right">
                                    KES {feeStructure.libraryFee.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Transport Fee</TableCell>
                                <TableCell className="text-right">
                                    KES {feeStructure.transportFee.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Total</TableCell>
                                <TableCell className="text-right font-bold">
                                    KES {feeStructure.total.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Balance After</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                        KES {transaction.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{transaction.paymentMethod}</TableCell>
                                    <TableCell>
                                        KES {transaction.balanceAfter.toLocaleString()}
                                    </TableCell>
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
