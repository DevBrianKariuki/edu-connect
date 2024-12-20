import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import StaffFormDialog from '@/components/staff/StaffFormDialog';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const mockStaffMembers: StaffMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Teacher",
    department: "Mathematics",
    email: "john.doe@edukenya.com",
    phone: "+254 712 345 678",
    joinDate: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Administrator",
    department: "Administration",
    email: "jane.smith@edukenya.com",
    phone: "+254 723 456 789",
    joinDate: "2023-02-01",
    status: "active",
  },
];

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const departments = ["Mathematics", "English", "Science", "Social Studies", "Administration"];

  const filteredStaff = mockStaffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment ? staff.department === selectedDepartment : true;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleAddStaff = (data: any) => {
    console.log('Adding staff member:', data);
    setShowAddStaffDialog(false);
  };

  const handleEditStaff = (data: any) => {
    console.log('Editing staff member:', data);
    setEditingStaff(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Button
          onClick={() => setShowAddStaffDialog(true)}
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Staff</h3>
          <p className="text-3xl font-bold">{mockStaffMembers.length}</p>
          <p className="text-sm text-gray-500">Active Members</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Departments</h3>
          <p className="text-3xl font-bold">{departments.length}</p>
          <p className="text-sm text-gray-500">Academic & Administrative</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">New Hires</h3>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-gray-500">This Month</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow
                key={staff.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setEditingStaff(staff)}
              >
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.joinDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                    {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StaffFormDialog
        open={showAddStaffDialog}
        onOpenChange={setShowAddStaffDialog}
        onSubmit={handleAddStaff}
        departments={departments}
      />

      {editingStaff && (
        <StaffFormDialog
          open={!!editingStaff}
          onOpenChange={() => setEditingStaff(null)}
          initialData={editingStaff}
          onSubmit={handleEditStaff}
          departments={departments}
        />
      )}
    </div>
  );
};

export default StaffPage;