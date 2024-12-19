import React from "react";
import { Users, BookOpen, Calendar, Bell } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-text-secondary text-sm">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && <p className="text-secondary text-sm mt-1">{trend}</p>}
      </div>
      <Icon className="text-primary" size={24} />
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="card mt-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Recent Activity</h2>
      <button className="btn-secondary">View All</button>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Bell className="text-primary" size={20} />
          </div>
          <div>
            <h4 className="font-medium">New Assessment Added</h4>
            <p className="text-text-secondary text-sm">Mathematics - Grade 4</p>
          </div>
          <span className="text-text-secondary text-sm ml-auto">2h ago</span>
        </div>
      ))}
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
          <p className="text-text-secondary mt-1">Here's what's happening in your school today</p>
        </div>
        <button className="btn-primary">Add New Student</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Students"
          value="1,234"
          trend="+12% from last month"
        />
        <StatCard
          icon={BookOpen}
          label="Active Classes"
          value="32"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value="8"
          trend="Next: Parent Meeting"
        />
      </div>

      <RecentActivity />
    </div>
  );
};

export default Index;