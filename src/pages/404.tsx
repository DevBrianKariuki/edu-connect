import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-xl text-muted-foreground">Page not found</p>
				<p className="text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="mt-6">
					<Link to="/">
						<Button>Back to Home</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
