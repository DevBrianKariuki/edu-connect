import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface StudentFormData {
  admissionNo: string;
  firstName: string;
  lastName: string;
  class: string;
  gender: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  address: string;
}

const StudentDetails = () => {
  const { id } = useParams();
  const form = useForm<StudentFormData>({
    defaultValues: {
      admissionNo: "2024001",
      firstName: "John",
      lastName: "Kamau",
      class: "Grade 7",
      gender: "Male",
      dateOfBirth: "2010-05-15",
      parentName: "James Kamau",
      parentPhone: "+254712345678",
      address: "123 Nairobi, Kenya",
    },
  });

  const onSubmit = (data: StudentFormData) => {
    console.log("Form submitted:", data);
  };

  const handleDelete = () => {
    console.log("Delete student:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/students" className="text-muted-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold font-inter">Student Details</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="mr-2" size={16} />
          Delete Student
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="admissionNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2" size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StudentDetails;