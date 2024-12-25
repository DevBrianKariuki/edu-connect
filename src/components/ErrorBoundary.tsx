import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">{error.status}</h1>
					<p className="text-xl text-muted-foreground">
						{error.statusText}
					</p>
					{error.data?.message && (
						<p className="text-muted-foreground">
							{error.data.message}
						</p>
					)}
					<div className="mt-6">
						<Link to="/">
							<Button>Back to Home</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">Oops!</h1>
				<p className="text-xl text-muted-foreground">
					Something went wrong
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
