
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { createClass, updateClass } from "@/lib/firebase/classes";
import { getAllStaffMembers } from "@/lib/firebase/staff";

const classFormSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  capacity: z.coerce.number().int().positive("Capacity must be a positive number"),
  teacherId: z.string().min(1, "Please select a teacher"),
});

export type ClassFormData = z.infer<typeof classFormSchema>;

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClassFormData) => void;
  initialData?: {
    id?: string;
    name: string;
    capacity: number;
    teacher: string;
    teacherId?: string;
  };
}

export function ClassFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ClassFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      capacity: initialData?.capacity || 30,
      teacherId: initialData?.teacherId || "",
    },
  });

  useEffect(() => {
    async function fetchTeachers() {
      try {
        setIsLoading(true);
        const staffMembers = await getAllStaffMembers();
        const teachersList = staffMembers
          .filter(staff => staff.role === "Teacher" || staff.role === "Head of Department")
          .map(teacher => ({
            id: teacher.id,
            name: teacher.name
          }));
        setTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to load teachers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  const handleSubmit = async (data: ClassFormData) => {
    try {
      setIsSubmitting(true);

      const selectedTeacher = teachers.find(t => t.id === data.teacherId);
      if (!selectedTeacher) {
        toast.error("Selected teacher not found");
        return;
      }

      const classData = {
        name: data.name,
        capacity: data.capacity,
        teacher: selectedTeacher.name,
        teacherId: selectedTeacher.id
      };

      if (initialData?.id) {
        // Update existing class
        await updateClass(initialData.id, classData);
        toast.success("Class updated successfully");
      } else {
        // Create new class
        await createClass(classData);
        toast.success("Class created successfully");
      }

      onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting class form:", error);
      toast.error("Failed to submit class details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] dark:bg-background dark:border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData?.id ? "Edit Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Grade 6A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="30" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-secondary">
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading teachers...
                        </SelectItem>
                      ) : teachers.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No teachers available
                        </SelectItem>
                      ) : (
                        teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Submitting...</>
                ) : initialData?.id ? (
                  "Update Class"
                ) : (
                  "Create Class"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
