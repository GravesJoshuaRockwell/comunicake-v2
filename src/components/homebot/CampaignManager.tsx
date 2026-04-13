"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate: string;
  status: "scheduled" | "sending" | "sent";
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "March Home Value Reports",
    recipients: 847,
    openRate: 73,
    clickRate: 18,
    sentDate: "2026-03-01",
    status: "sent",
  },
  {
    id: "2",
    name: "Spring Refinancing Opportunity",
    recipients: 324,
    openRate: 0,
    clickRate: 0,
    sentDate: "2026-04-15",
    status: "scheduled",
  },
  {
    id: "3",
    name: "Equity Analysis & Options",
    recipients: 625,
    openRate: 68,
    clickRate: 22,
    sentDate: "2026-02-01",
    status: "sent",
  },
];

export function CampaignManager() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "sending":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign */}
      <div className="p-8 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-dashed border-green-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 rounded-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">
              Create New Campaign
            </h3>
            <p className="text-sm text-slate-600">
              Design and schedule automated reports for your clients
            </p>
          </div>
          <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition">
            New Campaign
          </button>
        </div>
      </div>

      {/* Campaign Templates */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Campaign Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Monthly Digest",
              desc: "Home value & equity updates",
              icon: "📊",
            },
            {
              title: "Refinance Alert",
              desc: "Rate-based refinance offers",
              icon: "💰",
            },
            {
              title: "Move Prediction",
              desc: "Alert clients likely to move",
              icon: "🏠",
            },
          ].map((template, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition cursor-pointer">
              <div className="text-4xl mb-4">{template.icon}</div>
              <h4 className="font-semibold text-slate-900 mb-2">
                {template.title}
              </h4>
              <p className="text-sm text-slate-600 mb-4">{template.desc}</p>
              <button className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded transition">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="font-bold text-slate-900">Campaign History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Click Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, idx) => (
                <tr
                  key={campaign.id}
                  className={`border-b transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {campaign.recipients}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {campaign.openRate > 0 ? `${campaign.openRate}%` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {campaign.clickRate > 0 ? `${campaign.clickRate}%` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(campaign.sentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
