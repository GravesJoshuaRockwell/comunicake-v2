"use client";

import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { ClientList } from "./ClientList";
import { CampaignManager } from "./CampaignManager";
import { Analytics } from "./Analytics";
import { Home, Users, Mail, BarChart3 } from "lucide-react";

export function HomeBot() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">HomeBot</h1>
          </div>
          <p className="text-slate-600">
            Client engagement & home wealth management platform
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid w-full grid-cols-4 mb-6 border-b border-slate-200">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "clients", label: "Clients", icon: Users },
              { id: "campaigns", label: "Campaigns", icon: Mail },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div>
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "clients" && <ClientList />}
            {activeTab === "campaigns" && <CampaignManager />}
            {activeTab === "analytics" && <Analytics />}
          </div>
        </div>
      </div>
    </div>
  );
}
