import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Trash, PenSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StudentFormData {
  admissionNo: string;
  firstName: string;
  lastName: string;
  class: string;
  classTeacher: string;
  classTeacherPhone: string;
  gender: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  address: string;
  imageUrl: string;
}

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<StudentFormData>({
    defaultValues: {
      admissionNo: "2024001",
      firstName: "John",
      lastName: "Kamau",
      class: "Grade 7",
      classTeacher: "Mrs. Jane Doe",
      classTeacherPhone: "+254712345678",
      gender: "Male",
      dateOfBirth: "2010-05-15",
      parentName: "James Kamau",
      parentPhone: "+254712345678",
      address: "123 Nairobi, Kenya",
      imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    },
  });

  const onSubmit = (data: StudentFormData) => {
    console.log("Form submitted:", data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      console.log("Delete student:", id);
      navigate("/students");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/students" className="text-muted-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold font-inter">Student Details</h1>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <PenSquare className="mr-2" size={16} />
              Edit
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2" size={16} />
            Delete Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar className="w-32 h-32">
          <AvatarImage src={form.getValues("imageUrl")} alt="Student photo" />
          <AvatarFallback>
            {form.getValues("firstName").charAt(0)}
            {form.getValues("lastName").charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">
          {form.getValues("firstName")} {form.getValues("lastName")}
        </h2>
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classTeacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classTeacherPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher Phone</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input type="date" {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
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
                    <Input {...field} readOnly={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default StudentDetails;