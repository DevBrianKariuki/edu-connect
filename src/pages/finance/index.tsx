import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinancePage() {
	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Finance Management</h1>
				<div className="space-x-2">
					<Button variant="outline">Export</Button>
					<Button>Record Payment</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-4 mb-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Collections
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">KES 0</div>
						<p className="text-xs text-muted-foreground">
							+0% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Outstanding Fees
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">KES 0</div>
						<p className="text-xs text-muted-foreground">
							0 students with balance
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Today's Collection
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">KES 0</div>
						<p className="text-xs text-muted-foreground">
							0 payments today
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Expenses
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">KES 0</div>
						<p className="text-xs text-muted-foreground">
							0 transactions this month
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="payments" className="space-y-4">
				<TabsList>
					<TabsTrigger value="payments">Recent Payments</TabsTrigger>
					<TabsTrigger value="expenses">Expenses</TabsTrigger>
					<TabsTrigger value="fee-structure">
						Fee Structure
					</TabsTrigger>
				</TabsList>

				<TabsContent value="payments">
					<Card>
						<CardHeader>
							<CardTitle>Recent Payments</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Receipt No</TableHead>
										<TableHead>Student</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Payment Mode</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-6 text-muted-foreground">
											No payments recorded
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="expenses">
					<Card>
						<CardHeader>
							<CardTitle>Expenses</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Description</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-6 text-muted-foreground">
											No expenses recorded
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="fee-structure">
					<Card>
						<CardHeader>
							<CardTitle>Fee Structure</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Class</TableHead>
										<TableHead>Term Fee</TableHead>
										<TableHead>Activity Fee</TableHead>
										<TableHead>Total</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-6 text-muted-foreground">
											No fee structure defined
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
