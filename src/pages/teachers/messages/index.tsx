
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, User } from "lucide-react";

const conversations = [
    {
        id: 1,
        name: "Sarah's Parent",
        lastMessage: "Thank you for the update regarding Sarah's progress.",
        time: "10:30 AM",
        unread: true,
    },
    {
        id: 2,
        name: "John's Guardian",
        lastMessage: "When is the next parent-teacher meeting?",
        time: "Yesterday",
        unread: false,
    },
    {
        id: 3,
        name: "Principal Johnson",
        lastMessage: "Please submit the term reports by Friday.",
        time: "2 days ago",
        unread: false,
    },
];

export default function TeacherMessagesPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors
                                    ${conversation.unread 
                                        ? "bg-primary/5 hover:bg-primary/10" 
                                        : "hover:bg-accent"}`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{conversation.name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {conversation.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {conversation.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Message Thread</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                            <div className="text-center space-y-3">
                                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                                <div className="text-muted-foreground">
                                    Select a conversation to view messages
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Input placeholder="Type your message..." />
                            <Button>Send</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
