"use client";

import { TrendingUp, Mail, Eye, AlertCircle } from "lucide-react";

export function Dashboard() {
  // Mock data
  const stats = [
    {
      title: "Total Clients",
      value: "1,247",
      change: "+12%",
      icon: "👥",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Avg Home Value",
      value: "$485K",
      change: "+8.2%",
      icon: "🏠",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Email Open Rate",
      value: "73%",
      change: "+5%",
      icon: "📧",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "2 ending soon",
      icon: "📊",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      client: "Joshua Graves",
      type: "Move Likely",
      timeframe: "9-12 months",
      equity: "$120K",
    },
    {
      id: 2,
      client: "Shaun Anderson",
      type: "Refinance Ready",
      timeframe: "Immediate",
      equity: "$85K",
    },
    {
      id: 3,
      client: "Carter Evans",
      type: "Equity Update",
      timeframe: "Recent",
      equity: "$55K",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Alerts */}
        <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Lead Alerts (Likely to Move/Refinance)
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-gradient-to-r from-orange-50 to-transparent border border-orange-100 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {alert.client}
                    </p>
                    <p className="text-sm text-slate-600">{alert.type}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Timeframe: {alert.timeframe}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {alert.equity}
                    </p>
                    <p className="text-xs text-slate-500">available equity</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
              Import Clients
            </button>
            <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition">
              Create Campaign
            </button>
            <button className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition">
              Send Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Recent Report Engagement
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>Joshua Graves opened March Report</span>
            <span className="text-slate-500">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>Shaun Anderson viewed property value</span>
            <span className="text-slate-500">5 hours ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>Carter Evans clicked refinance offer</span>
            <span className="text-slate-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
