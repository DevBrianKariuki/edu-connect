import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, School, User, Calendar, Users } from "lucide-react";

interface Parent {
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  relationship: string;
}

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
    address: string;
    imageUrl: string;
    parents: Parent[];
  };
}

const StudentProfile = ({ student }: StudentProfileProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Photo and Basic Info */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              {student.imageUrl ? (
                <img
                  src={student.imageUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Student ID: {student.admissionNo}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <School className="w-4 h-4" />
                  <span>{student.class}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{student.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{student.gender}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Academic Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Class Teacher</label>
                  <p className="mt-1">{student.classTeacher}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teacher's Contact</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {student.classTeacherPhone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {student.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parents/Guardians Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Parents/Guardians</h3>
              <div className="space-y-6">
                {student.parents.map((parent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{parent.name}</h4>
                      <span className="text-sm text-gray-500">{parent.relationship}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {parent.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {parent.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        ID: {parent.nationalId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;