import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter } from "lucide-react";

interface FeeRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  amount: number;
  date: string;
  term: string;
  status: 'paid' | 'partial' | 'pending';
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
  },
  {
    id: "2",
    studentName: "Sarah Wanjiku",
    admissionNo: "2024002",
    amount: 35000,
    date: "2024-01-16",
    term: "Term 1",
    status: "partial",
  },
];

const FinancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  const filteredRecords = mockFeeRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTerm = selectedTerm ? record.term === selectedTerm : true;
    return matchesSearch && matchesTerm;
  });

  const terms = ["Term 1", "Term 2", "Term 3"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter">Finance Management</h1>
        <button
          className="btn-primary flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Collections</h3>
          <p className="text-3xl font-bold">KES 70,000</p>
          <p className="text-sm text-gray-500">Current Term</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Outstanding Fees</h3>
          <p className="text-3xl font-bold">KES 35,000</p>
          <p className="text-sm text-gray-500">5 Students</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Expected Collections</h3>
          <p className="text-3xl font-bold">KES 105,000</p>
          <p className="text-sm text-gray-500">Total for Term</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by student name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="input-field appearance-none pr-10 h-10 rounded-md border border-input bg-background px-3"
          >
            <option value="">All Terms</option>
            {terms.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow
                key={record.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{record.studentName}</TableCell>
                <TableCell>{record.admissionNo}</TableCell>
                <TableCell>KES {record.amount.toLocaleString()}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.term}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FinancePage;