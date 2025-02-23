
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    MapPin,
    BookOpen,
} from "lucide-react";

// Sample teacher data (in a real app, this would come from an API)
const teacherData = {
    id: "1",
    name: "John Smith",
    email: "john.smith@school.com",
    phone: "+254 712 345 678",
    subject: "Mathematics",
    classTeacher: "Form 1A",
    status: "active",
    joinDate: "2023-01-15",
    qualification: "B.Ed Mathematics",
    address: "123 Teacher Lane, Nairobi",
    expertise: ["Calculus", "Algebra", "Statistics"],
    currentClasses: [
        { class: "Form 1A", subject: "Mathematics", schedule: "Mon, Wed 8:00 AM" },
        { class: "Form 2B", subject: "Mathematics", schedule: "Tue, Thu 10:00 AM" },
    ],
};

export default function TeacherDetailsPage() {
    const { id } = useParams();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Teacher Details</h1>
                <Button variant="outline">Edit Profile</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{teacherData.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Teacher ID: {teacherData.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <p>{teacherData.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <p>{teacherData.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            <p>{teacherData.qualification}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <p>Joined: {teacherData.joinDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <p>{teacherData.address}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Tabs */}
                <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                        <Tabs defaultValue="schedule">
                            <TabsList>
                                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                <TabsTrigger value="classes">Classes</TabsTrigger>
                                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                            </TabsList>
                            <TabsContent value="schedule" className="space-y-4">
                                <h3 className="text-lg font-semibold">Current Schedule</h3>
                                <div className="space-y-4">
                                    {teacherData.currentClasses.map((cls, index) => (
                                        <Card key={index}>
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{cls.class}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {cls.subject}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm">{cls.schedule}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="classes">
                                <div className="space-y-2">
                                    <p className="font-medium">Class Teacher</p>
                                    <p>{teacherData.classTeacher}</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="expertise">
                                <div className="space-y-2">
                                    <p className="font-medium">Areas of Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teacherData.expertise.map((item, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
