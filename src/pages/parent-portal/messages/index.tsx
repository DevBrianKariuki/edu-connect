
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MessageCircle,
    Send,
    Search,
    Phone,
    VideoCamera,
    MoreVertical,
} from "lucide-react";

// Dummy data for development
const conversations = [
    {
        id: 1,
        name: "Mrs. Johnson",
        role: "Class Teacher",
        avatar: "",
        lastMessage: "Thank you for attending the parent-teacher meeting",
        timestamp: "2:30 PM",
        unread: 2,
    },
    {
        id: 2,
        name: "Mr. Smith",
        role: "Math Teacher",
        avatar: "",
        lastMessage: "Jane has shown great improvement in calculus",
        timestamp: "Yesterday",
        unread: 0,
    },
];

const messages = [
    {
        id: 1,
        sender: "Mrs. Johnson",
        content: "Hello! How are you today?",
        timestamp: "2:30 PM",
        isSender: false,
    },
    {
        id: 2,
        sender: "You",
        content: "Hi Mrs. Johnson, I'm doing well. How are you?",
        timestamp: "2:31 PM",
        isSender: true,
    },
    {
        id: 3,
        sender: "Mrs. Johnson",
        content:
            "I wanted to discuss Jane's progress in class. She's doing very well!",
        timestamp: "2:32 PM",
        isSender: false,
    },
];

const MessagesPage = () => {
    const [newMessage, setNewMessage] = useState("");
    const [selectedConversation, setSelectedConversation] = useState(
        conversations[0]
    );

    return (
        <div className="h-[calc(100vh-3.5rem)] flex animate-fadeIn">
            {/* Conversations List */}
            <div className="w-80 border-r bg-muted/50">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <h2 className="font-semibold">Messages</h2>
                    </div>
                    <div className="mt-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedConversation.id === conversation.id
                                    ? "bg-muted"
                                    : ""
                            }`}
                            onClick={() => setSelectedConversation(conversation)}>
                            <div className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarImage src={conversation.avatar} />
                                    <AvatarFallback>
                                        {conversation.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold truncate">
                                            {conversation.name}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">
                                            {conversation.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conversation.lastMessage}
                                    </p>
                                </div>
                                {conversation.unread > 0 && (
                                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {conversation.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={selectedConversation.avatar}
                                alt={selectedConversation.name}
                            />
                            <AvatarFallback>
                                {selectedConversation.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">
                                {selectedConversation.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedConversation.role}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <VideoCamera className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.isSender
                                        ? "justify-end"
                                        : "justify-start"
                                }`}>
                                <div
                                    className={`max-w-[70%] ${
                                        message.isSender
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    } rounded-lg px-4 py-2`}>
                                    {!message.isSender && (
                                        <p className="text-sm font-semibold">
                                            {message.sender}
                                        </p>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
