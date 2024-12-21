import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	Plus,
	Filter,
	TrendingUp,
	ArrowDown,
	ArrowUp,
	Download,
	Wallet,
	CreditCard,
	FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FeeRecord {
	id: string;
	studentName: string;
	admissionNo: string;
	amount: number;
	date: string;
	term: string;
	status: "paid" | "partial" | "pending";
	paymentMethod?: string;
	receiptNo?: string;
}

const mockFeeRecords: FeeRecord[] = [
	{
		id: "1",
		studentName: "John Kamau",
		admissionNo: "2024001",
		amount: 35000,
		date: "2024-01-15",
		term: "Term 1",
		status: "paid",
		paymentMethod: "Bank Transfer",
		receiptNo: "RCP001",
	},
	{
		id: "2",
		studentName: "Sarah Wanjiku",
		admissionNo: "2024002",
		amount: 35000,
		date: "2024-01-16",
		term: "Term 1",
		status: "partial",
		paymentMethod: "M-Pesa",
		receiptNo: "RCP002",
	},
];

const FinancePage = () => {
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);

	const filteredRecords = mockFeeRecords.filter((record) => {
		const matchesSearch =
			record.studentName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			record.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTerm = selectedTerm ? record.term === selectedTerm : true;
		return matchesSearch && matchesTerm;
	});

	const terms = ["Term 1", "Term 2", "Term 3"];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800";
			case "partial":
				return "bg-yellow-100 text-yellow-800";
			case "pending":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleExport = (format: string) => {
		toast({
			title: "Exporting Report",
			description: `Generating ${format} report...`,
		});
	};

	const handleRecordPayment = () => {
		setShowPaymentDialog(false);
		toast({
			title: "Payment Recorded",
			description: "The payment has been successfully recorded.",
		});
	};

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Finance Management
					</h1>
					<p className="text-muted-foreground">
						Manage school fees and payments
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => handleExport("pdf")}
						className="gap-2">
						<Download className="h-4 w-4" />
						Export Report
					</Button>
					<Button
						onClick={() => setShowPaymentDialog(true)}
						className="bg-primary text-primary-foreground gap-2">
						<Plus className="h-4 w-4" />
						Record Payment
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card
					className={cn(
						"relative overflow-hidden transition-all hover:shadow-lg",
						"border-0 bg-gradient-to-br from-green-600 to-green-700 p-6"
					)}>
					<div className="relative z-10">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Wallet className="text-white" size={20} />
									<p className="text-sm font-medium text-white/80">
										Total Collections
									</p>
								</div>
								<h3 className="text-2xl font-bold text-white">
									KES 70,000
								</h3>
								<p className="text-sm text-white/80 flex items-center gap-1">
									<TrendingUp className="h-4 w-4" />
									+15% from last term
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card
					className={cn(
						"relative overflow-hidden transition-all hover:shadow-lg",
						"border-0 bg-gradient-to-br from-yellow-600 to-yellow-700 p-6"
					)}>
					<div className="relative z-10">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<CreditCard
										className="text-white"
										size={20}
									/>
									<p className="text-sm font-medium text-white/80">
										Outstanding Fees
									</p>
								</div>
								<h3 className="text-2xl font-bold text-white">
									KES 35,000
								</h3>
								<p className="text-sm text-white/80">
									5 Students
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card
					className={cn(
						"relative overflow-hidden transition-all hover:shadow-lg",
						"border-0 bg-gradient-to-br from-blue-600 to-blue-700 p-6"
					)}>
					<div className="relative z-10">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<FileText
										className="text-white"
										size={20}
									/>
									<p className="text-sm font-medium text-white/80">
										Expected Collections
									</p>
								</div>
								<h3 className="text-2xl font-bold text-white">
									KES 105,000
								</h3>
								<p className="text-sm text-white/80">
									Total for Term
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<Card className="border-0 shadow-lg">
				<div className="p-6 space-y-6">
					<div className="flex gap-4 items-center">
						<div className="relative flex-1">
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={20}
							/>
							<Input
								placeholder="Search by student name or admission number..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select
							value={selectedTerm || undefined}
							onValueChange={setSelectedTerm}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select Term" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Terms</SelectItem>
								{terms.map((term) => (
									<SelectItem key={term} value={term}>
										{term}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student Name</TableHead>
									<TableHead>Admission No.</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Payment Method</TableHead>
									<TableHead>Receipt No.</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Term</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredRecords.map((record) => (
									<TableRow
										key={record.id}
										className="cursor-pointer hover:bg-accent/50 transition-colors">
										<TableCell className="font-medium">
											{record.studentName}
										</TableCell>
										<TableCell>
											{record.admissionNo}
										</TableCell>
										<TableCell>
											KES {record.amount.toLocaleString()}
										</TableCell>
										<TableCell>
											{record.paymentMethod}
										</TableCell>
										<TableCell>
											{record.receiptNo}
										</TableCell>
										<TableCell>{record.date}</TableCell>
										<TableCell>{record.term}</TableCell>
										<TableCell>
											<span
												className={cn(
													"px-3 py-1 rounded-full text-xs font-medium",
													getStatusColor(
														record.status
													)
												)}>
												{record.status
													.charAt(0)
													.toUpperCase() +
													record.status.slice(1)}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</Card>

			<Dialog
				open={showPaymentDialog}
				onOpenChange={setShowPaymentDialog}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Record New Payment</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Student
							</label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select student" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2024001">
										John Kamau - 2024001
									</SelectItem>
									<SelectItem value="2024002">
										Sarah Wanjiku - 2024002
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Amount
							</label>
							<Input type="number" placeholder="Enter amount" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Payment Method
							</label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select payment method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="bank_transfer">
										Bank Transfer
									</SelectItem>
									<SelectItem value="mpesa">
										M-Pesa
									</SelectItem>
									<SelectItem value="cash">Cash</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Term</label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select term" />
								</SelectTrigger>
								<SelectContent>
									{terms.map((term) => (
										<SelectItem
											key={term}
											value={term
												.toLowerCase()
												.replace(" ", "_")}>
											{term}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => setShowPaymentDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleRecordPayment}>
							Record Payment
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FinancePage;
