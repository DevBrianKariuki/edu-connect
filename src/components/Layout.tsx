
import { useAuth } from "@/lib/auth/AuthContext";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import TeacherSidebar from "./TeacherSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const { state } = useAuth();

    return (
        <div className="min-h-screen flex bg-background">
            {state.user?.role === "teacher" ? <TeacherSidebar /> : <Sidebar />}
            <div className="flex-1">
                <TopBar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
