"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, Filter, TrendingUp } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  homeValue: number;
  equity: number;
  lastContact: string;
  status: "active" | "prospect" | "archived";
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Joshua Graves",
    email: "joshua.graves@example.com",
    homeValue: 580000,
    equity: 232000,
    lastContact: "2026-01-06",
    status: "active",
  },
  {
    id: "2",
    name: "Shaun Anderson",
    email: "swanderson05@gmail.com",
    homeValue: 570000,
    equity: 347500,
    lastContact: "2025-12-15",
    status: "active",
  },
  {
    id: "3",
    name: "Carter Evans",
    email: "carterevans11@yahoo.com",
    homeValue: 440000,
    equity: 192000,
    lastContact: "2025-12-18",
    status: "active",
  },
  {
    id: "4",
    name: "Daniel Hansen",
    email: "danhansen51@icloud.com",
    homeValue: 260000,
    equity: 67500,
    lastContact: "2025-11-30",
    status: "active",
  },
];

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "prospect" | "archived">(
    "active"
  );
  const [clients] = useState<Client[]>(mockClients);

  const filtered = clients.filter(
    (c) =>
      (filterStatus === "all" || c.status === filterStatus) &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Import Clients</h3>
              <p className="text-sm text-slate-600">
                Upload CSV or Excel file with client contact data
              </p>
            </div>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
              Choose File
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-slate-600 mt-2" />
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "prospect" | "archived"
                )
              }
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b">
          <CardTitle>
            Clients ({filtered.length}/{clients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Home Value
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Equity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Last Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, idx) => (
                  <tr
                    key={client.id}
                    className={`border-b transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ${(client.homeValue / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      ${(client.equity / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(client.lastContact).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
