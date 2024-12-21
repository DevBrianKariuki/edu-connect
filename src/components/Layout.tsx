import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="relative flex min-h-screen">
			<Sidebar />
			<div className="flex-1">
				<TopBar />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
