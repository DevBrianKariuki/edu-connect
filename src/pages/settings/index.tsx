
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Mail, Shield, School } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth/AuthContext";

interface SchoolSettings {
  name: string;
  location: string;
  phone: string;
  email: string;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [schoolData, setSchoolData] = useState<SchoolSettings>({
    name: "",
    location: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!state.user?.id) return;

      try {
        const schoolDoc = await getDoc(doc(db, "schools", state.user.id));
        if (schoolDoc.exists()) {
          const data = schoolDoc.data() as SchoolSettings;
          setSchoolData(data);
        }
      } catch (error) {
        console.error("Error fetching school data:", error);
        toast({
          title: "Error",
          description: "Failed to load school settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolData();
  }, [state.user?.id, toast]);

  const handleSave = async () => {
    if (!state.user?.id) return;

    try {
      // Fix: Use object literal directly to ensure correct type for updateDoc
      await updateDoc(doc(db, "schools", state.user.id), {
        name: schoolData.name,
        location: schoolData.location,
        phone: schoolData.phone,
        email: schoolData.email
      });
      
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof SchoolSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:max-w-[600px] h-auto gap-4">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Academic
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your school's general settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input 
                  id="schoolName" 
                  value={schoolData.name} 
                  onChange={handleInputChange('name')}
                  placeholder="Enter school name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">School Address</Label>
                <Input 
                  id="address" 
                  value={schoolData.location}
                  onChange={handleInputChange('location')}
                  placeholder="Enter school address" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <Input 
                  id="phone" 
                  value={schoolData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="Enter contact number" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">School Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={schoolData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter school email" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS alerts for urgent matters
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>
                Configure academic year and grading settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Current Academic Year</Label>
                <Input id="academicYear" placeholder="2023-2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradingSystem">Grading System</Label>
                <Input id="gradingSystem" placeholder="A, B, C, D, E" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Term System</Label>
                  <p className="text-sm text-muted-foreground">
                    Divide academic year into terms
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable extra security on your account
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
