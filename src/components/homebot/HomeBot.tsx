"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients">
            <ClientList />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
