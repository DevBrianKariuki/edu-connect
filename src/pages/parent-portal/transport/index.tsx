
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Bus, Route, Phone, Banknote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy data for development
const academicYears = ["2024", "2023", "2022"];
const terms = ["Term 1", "Term 2", "Term 3"];

const routeStops = [
    { time: "6:30 AM", location: "Westlands Mall" },
    { time: "6:45 AM", location: "Sarit Centre" },
    { time: "7:00 AM", location: "ABC Place" },
    { time: "7:30 AM", location: "School" },
];

const driverInfo = {
    name: "John Doe",
    phone: "+254 712 345 678",
};

const transportFee = {
    amount: 15000,
    status: "paid", // or "unpaid"
};

const transactions = [
    {
        id: 1,
        date: "2024-03-01",
        amount: 15000,
        term: "Term 1",
        year: "2024",
        status: "completed",
        reference: "TR123456",
    },
];

const TransportTrackingPage = () => {
    const [selectedYear, setSelectedYear] = useState(academicYears[0]);
    const [selectedTerm, setSelectedTerm] = useState(terms[0]);

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Bus className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Transport Tracking</h1>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:bg-accent transition-colors">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Bus Route
                                        </p>
                                        <p className="text-2xl font-bold">Route A</p>
                                    </div>
                                    <Route className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Route Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {routeStops.map((stop, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-20 text-sm text-muted-foreground">
                                        {stop.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{stop.location}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bus Number
                                </p>
                                <p className="text-2xl font-bold">KCB 123X</p>
                            </div>
                            <Bus className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Driver Information
                                </p>
                                <p className="text-lg font-bold">{driverInfo.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {driverInfo.phone}
                                </p>
                            </div>
                            <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transport Fee Status</CardTitle>
                    <CardDescription>
                        Transport fee status for {selectedTerm} {selectedYear}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="text-2xl font-bold">
                                KES {transportFee.amount.toLocaleString()}
                            </p>
                        </div>
                        <Badge variant={transportFee.status === "paid" ? "default" : "destructive"}>
                            {transportFee.status === "paid" ? "Paid" : "Unpaid"}
                        </Badge>
                    </div>
                    {transportFee.status === "unpaid" && (
                        <Button className="w-full gap-2">
                            <Banknote className="h-4 w-4" />
                            Pay Transport Fee
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Transport fee payment history</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Term</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.reference}</TableCell>
                                    <TableCell>
                                        {transaction.term} - {transaction.year}
                                    </TableCell>
                                    <TableCell>
                                        KES {transaction.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Live Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[600px] rounded-lg border bg-card p-4">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Google Maps integration will be implemented here to show real-time location of the bus
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransportTrackingPage;
