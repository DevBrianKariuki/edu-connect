import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface StudentProfileProps {
  student: {
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
  };
}

const StudentProfile = ({ student }: StudentProfileProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-100">
          {student.imageUrl ? (
            <img
              src={student.imageUrl}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl font-semibold text-gray-400">
                {student.firstName[0]}
                {student.lastName[0]}
              </span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">
          {student.firstName} {student.lastName}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Admission Number</dt>
                <dd className="text-base">{student.admissionNo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="text-base">{student.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-base">{student.dateOfBirth}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-base">{student.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="text-base">{student.class}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Class Teacher</dt>
                <dd className="text-base">{student.classTeacher}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teacher's Contact</dt>
                <dd className="text-base">{student.classTeacherPhone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-base">{student.parentName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="text-base">{student.parentPhone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;