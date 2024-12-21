import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface EventDetailsDialogProps {
	event: {
		id: string;
		title: string;
		date: Date;
		type: "academic" | "holiday" | "exam" | "other";
		description?: string;
	} | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({
	event,
	open,
	onOpenChange,
}: EventDetailsDialogProps) {
	if (!event) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{event.title}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<p className="text-sm font-medium">Date</p>
						<p className="text-sm text-gray-500">
							{event.date.toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-medium">Type</p>
						<p className="text-sm text-gray-500 capitalize">
							{event.type}
						</p>
					</div>
					{event.description && (
						<div className="space-y-2">
							<p className="text-sm font-medium">Description</p>
							<p className="text-sm text-gray-500">
								{event.description}
							</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
