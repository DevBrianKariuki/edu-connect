
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function TeacherSettingsPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Manage your profile information and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Jane Smith" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="jane.smith@school.edu" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue="+1 (555) 000-0000" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="message-notifications">Message Notifications</Label>
                            <Switch id="message-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="attendance-updates">Attendance Updates</Label>
                            <Switch id="attendance-updates" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Privacy</CardTitle>
                        <CardDescription>
                            Manage your privacy settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="profile-visibility">Public Profile Visibility</Label>
                            <Switch id="profile-visibility" />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="online-status">Show Online Status</Label>
                            <Switch id="online-status" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
