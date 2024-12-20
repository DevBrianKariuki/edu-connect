import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  title: string;
  content: string;
  type: "email" | "sms";
  recipients: string;
  sentAt: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    title: "End Term Exams Schedule",
    content: "Dear Parents, The end term exams will begin on Monday...",
    type: "email",
    recipients: "All Parents",
    sentAt: "2024-03-15 09:00",
  },
  {
    id: "2",
    title: "School Closure Notice",
    content: "Due to maintenance work, school will remain closed tomorrow...",
    type: "sms",
    recipients: "All Parents",
    sentAt: "2024-03-14 15:30",
  },
];

const CommunicationPage = () => {
  const { toast } = useToast();
  const [messageType, setMessageType] = useState<"email" | "sms">("email");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState("all");

  const handleSend = () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically integrate with an email/SMS service
    toast({
      title: "Success",
      description: `${messageType.toUpperCase()} sent successfully`,
    });

    // Reset form
    setTitle("");
    setContent("");
    setRecipients("all");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communication</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={messageType} onValueChange={(v) => setMessageType(v as "email" | "sms")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Recipients</label>
                      <Select value={recipients} onValueChange={setRecipients}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Parents</SelectItem>
                          <SelectItem value="class">By Class</SelectItem>
                          <SelectItem value="individual">Individual Parents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter email subject"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your message here"
                        rows={6}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sms" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Recipients</label>
                      <Select value={recipients} onValueChange={setRecipients}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Parents</SelectItem>
                          <SelectItem value="class">By Class</SelectItem>
                          <SelectItem value="individual">Individual Parents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your SMS message here"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button onClick={handleSend} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send {messageType === "email" ? "Email" : "SMS"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 rounded-lg border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{message.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.type === "email"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {message.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{message.recipients}</span>
                      <span>{message.sentAt}</span>
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

export default CommunicationPage;