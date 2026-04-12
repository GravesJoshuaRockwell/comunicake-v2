"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
  Clock,
} from "lucide-react";

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                +5%
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-2">Avg Open Rate</p>
            <p className="text-3xl font-bold text-slate-900">73%</p>
            <p className="text-xs text-slate-500 mt-3">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <MousePointerClick className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-2">Avg Click Rate</p>
            <p className="text-3xl font-bold text-slate-900">18%</p>
            <p className="text-xs text-slate-500 mt-3">Link engagement</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                3 days
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-2">Avg Time to Open</p>
            <p className="text-3xl font-bold text-slate-900">2.1d</p>
            <p className="text-xs text-slate-500 mt-3">From send date</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Monthly Engagement Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { month: "January", opens: 68, clicks: 15 },
              { month: "February", opens: 70, clicks: 17 },
              { month: "March", opens: 73, clicks: 18 },
            ].map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    {data.month}
                  </span>
                  <span className="text-xs text-slate-600">
                    Opens: {data.opens}% | Clicks: {data.clicks}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${data.opens}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${data.clicks * 5}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Performing Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              {
                name: "March Home Value Reports",
                opens: 73,
                clicks: 18,
                sent: 847,
              },
              {
                name: "Equity Analysis & Options",
                opens: 68,
                clicks: 22,
                sent: 625,
              },
              {
                name: "Q1 Market Outlook",
                opens: 65,
                clicks: 15,
                sent: 892,
              },
            ].map((campaign, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Sent to {campaign.sent} clients
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {campaign.opens}% opens
                    </p>
                    <p className="text-xs text-slate-500">
                      {campaign.clicks}% clicks
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${campaign.opens}%` }}
                    />
                  </div>
                  <div className="flex-1 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${campaign.clicks * 5}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Segmentation */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Client Segmentation</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[
              { segment: "High Equity (>$200K)", count: 342, color: "bg-green-500" },
              {
                segment: "Medium Equity ($100K-$200K)",
                count: 521,
                color: "bg-blue-500",
              },
              {
                segment: "Building Equity (<$100K)",
                count: 284,
                color: "bg-orange-500",
              },
              { segment: "Refinance Ready", count: 100, color: "bg-purple-500" },
            ].map((seg, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    {seg.segment}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {seg.count} clients
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${seg.color} rounded-full`}
                    style={{ width: `${(seg.count / 521) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
