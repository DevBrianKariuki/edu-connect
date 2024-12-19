import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  joinDate: string;
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Alice Wangari",
    role: "Teacher",
    department: "Mathematics",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "David Ochieng",
    role: "Driver",
    department: "Transport",
    joinDate: "2023-02-01",
  },
  // Add more mock data as needed
];

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment ? staff.department === selectedDepartment : true;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(mockStaff.map(staff => staff.department)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter">Staff</h1>
        <Button>
          <Plus size={20} className="mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input-field appearance-none pr-10"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow
                key={staff.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{staff.employeeId}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.joinDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffPage;