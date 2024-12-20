import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LucideIcon, 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  Settings, 
  LogOut,
  Wallet,
  MessageSquare 
} from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-primary text-white"
        : "text-text-secondary hover:bg-primary/10"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: Users, label: "Staff", path: "/staff" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: MessageSquare, label: "Communication", path: "/communication" },
    { icon: Wallet, label: "Finance", path: "/finance" },
    { icon: BookOpen, label: "Academics", path: "/academics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-200 p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
          <h1 className="text-xl font-bold text-text-primary">EduKenya</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              to={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <button className="flex items-center space-x-3 text-text-secondary hover:text-primary transition-colors duration-300 w-full">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;