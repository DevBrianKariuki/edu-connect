
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
import { Mail, MessageSquare, Send, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
		content:
			"Due to maintenance work, school will remain closed tomorrow...",
		type: "sms",
		recipients: "All Parents",
		sentAt: "2024-03-14 15:30",
	},
];

interface FormErrors {
	title?: string;
	content?: string;
	recipients?: string;
}

const CommunicationPage = () => {
	const { toast } = useToast();
	const [messageType, setMessageType] = useState<"email" | "sms">("email");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [recipients, setRecipients] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!recipients) {
			newErrors.recipients = "Please select recipients";
		}

		if (messageType === "email") {
			if (!title.trim()) {
				newErrors.title = "Subject is required";
			} else if (title.length > 100) {
				newErrors.title = "Subject must be less than 100 characters";
			}
		}

		if (!content.trim()) {
			newErrors.content = "Message content is required";
		} else if (messageType === "sms" && content.length > 160) {
			newErrors.content = "SMS message must be less than 160 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleBlur = (field: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		validateForm();
	};

	const handleSend = () => {
		setTouched({ title: true, content: true, recipients: true });

		if (!validateForm()) {
			toast({
				title: "Validation Error",
				description: "Please correct the errors in the form",
				variant: "destructive",
			});
			return;
		}

		toast({
			title: "Success",
			description: `${messageType.toUpperCase()} sent successfully`,
		});

		// Reset form
		setTitle("");
		setContent("");
		setRecipients("");
		setErrors({});
		setTouched({});
	};

	const getInputErrorClass = (field: string) => {
		return touched[field] && errors[field]
			? "border-red-500 focus-visible:ring-red-500"
			: "";
	};

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Communication Hub
					</h1>
					<p className="text-muted-foreground">
						Send messages to parents and staff
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					<Card className="shadow-lg border-0">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">
								New Message
							</CardTitle>
							<p className="text-sm text-muted-foreground">
								Create and send messages to your school
								community
							</p>
						</CardHeader>
						<CardContent>
							<Tabs
								value={messageType}
								onValueChange={(v) => {
									setMessageType(v as "email" | "sms");
									setErrors({});
									setTouched({});
								}}
								className="space-y-6">
								<TabsList className="grid w-full grid-cols-2 h-14 rounded-lg p-1">
									<TabsTrigger
										value="email"
										className={cn(
											"flex items-center gap-2 text-base transition-all data-[state=active]:shadow-lg",
											"data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										)}>
										<Mail className="h-5 w-5" />
										Email
									</TabsTrigger>
									<TabsTrigger
										value="sms"
										className={cn(
											"flex items-center gap-2 text-base transition-all data-[state=active]:shadow-lg",
											"data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
										)}>
										<MessageSquare className="h-5 w-5" />
										SMS
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="email"
									className="space-y-6">
									<div className="space-y-6">
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Recipients
											</label>
											<Select
												value={recipients}
												onValueChange={(value) => {
													setRecipients(value);
													handleBlur("recipients");
												}}>
												<SelectTrigger
													className={cn(
														"h-12",
														getInputErrorClass(
															"recipients"
														)
													)}>
													<SelectValue placeholder="Select recipients" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">
														All Parents
													</SelectItem>
													<SelectItem value="class">
														By Class
													</SelectItem>
													<SelectItem value="individual">
														Individual Parents
													</SelectItem>
												</SelectContent>
											</Select>
											{touched.recipients &&
												errors.recipients && (
													<div className="flex items-center gap-1 text-red-500 text-sm mt-1">
														<AlertCircle className="h-4 w-4" />
														<span>
															{errors.recipients}
														</span>
													</div>
												)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Subject
											</label>
											<Input
												value={title}
												onChange={(e) =>
													setTitle(e.target.value)
												}
												onBlur={() =>
													handleBlur("title")
												}
												placeholder="Enter email subject"
												className={cn(
													"h-12",
													getInputErrorClass("title")
												)}
											/>
											{touched.title && errors.title && (
												<div className="flex items-center gap-1 text-red-500 text-sm mt-1">
													<AlertCircle className="h-4 w-4" />
													<span>{errors.title}</span>
												</div>
											)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Message
											</label>
											<Textarea
												value={content}
												onChange={(e) =>
													setContent(e.target.value)
												}
												onBlur={() =>
													handleBlur("content")
												}
												placeholder="Type your message here"
												rows={8}
												className={cn(
													"resize-none",
													getInputErrorClass(
														"content"
													)
												)}
											/>
											{touched.content &&
												errors.content && (
													<div className="flex items-center gap-1 text-red-500 text-sm mt-1">
														<AlertCircle className="h-4 w-4" />
														<span>
															{errors.content}
														</span>
													</div>
												)}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="sms" className="space-y-6">
									<div className="space-y-6">
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Recipients
											</label>
											<Select
												value={recipients}
												onValueChange={(value) => {
													setRecipients(value);
													handleBlur("recipients");
												}}>
												<SelectTrigger
													className={cn(
														"h-12",
														getInputErrorClass(
															"recipients"
														)
													)}>
													<SelectValue placeholder="Select recipients" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">
														All Parents
													</SelectItem>
													<SelectItem value="class">
														By Class
													</SelectItem>
													<SelectItem value="individual">
														Individual Parents
													</SelectItem>
												</SelectContent>
											</Select>
											{touched.recipients &&
												errors.recipients && (
													<div className="flex items-center gap-1 text-red-500 text-sm mt-1">
														<AlertCircle className="h-4 w-4" />
														<span>
															{errors.recipients}
														</span>
													</div>
												)}
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Message
											</label>
											<div className="space-y-1">
												<Textarea
													value={content}
													onChange={(e) =>
														setContent(
															e.target.value
														)
													}
													onBlur={() =>
														handleBlur("content")
													}
													placeholder="Type your SMS message here"
													rows={6}
													className={cn(
														"resize-none",
														getInputErrorClass(
															"content"
														)
													)}
												/>
												<div className="flex justify-end">
													<span
														className={cn(
															"text-xs",
															content.length > 160
																? "text-red-500"
																: "text-muted-foreground"
														)}>
														{content.length}/160
														characters
													</span>
												</div>
											</div>
											{touched.content &&
												errors.content && (
													<div className="flex items-center gap-1 text-red-500 text-sm mt-1">
														<AlertCircle className="h-4 w-4" />
														<span>
															{errors.content}
														</span>
													</div>
												)}
										</div>
									</div>
								</TabsContent>
							</Tabs>

							<div className="mt-8">
								<Button
									onClick={handleSend}
									className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]">
									<Send className="mr-2 h-5 w-5" />
									Send{" "}
									{messageType === "email" ? "Email" : "SMS"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<div>
					<Card className="shadow-lg border-0">
						<CardHeader className="space-y-1">
							<CardTitle className="text-xl flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Recent Messages
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{mockMessages.map((message) => (
									<div
										key={message.id}
										className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200 space-y-3 cursor-pointer">
										<div className="flex items-center justify-between">
											<h3 className="font-medium line-clamp-1">
												{message.title}
											</h3>
											<span
												className={cn(
													"px-3 py-1 rounded-full text-xs font-medium",
													message.type === "email"
														? "bg-blue-100 text-blue-800"
														: "bg-purple-100 text-purple-800"
												)}>
												{message.type.toUpperCase()}
											</span>
										</div>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{message.content}
										</p>
										<div className="flex justify-between items-center text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<Mail className="h-3 w-3" />
												{message.recipients}
											</span>
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
