"use client";

import Link from "next/link";
import { Search, Plus, Phone, Mail, Filter, Download, Upload, Info, X } from "lucide-react";
import { useState, useRef } from "react";

const CONTACTS_CSV_INFO = `Required columns for Contacts CSV upload:
• First Name + Last Name (or Full Name)
• Email
• Phone
• Company Name
• Loan Status (lead/pre-approval/application/processing/underwriting/clear-to-close/closed/lost)
• Loan Type (Conventional/FHA/VA/Jumbo/USDA/Non-QM/Reverse)
• Loan Amount (number)
• Credit Score (number)
• Lead Source
• City, State, Zip

Optional fields:
• Interest Rate, Purchase Price, Down Payment
• Annual Income, Employer, Employment Type
• Date of Birth, Current Rate (for refi calc)
• Notes, Tags (comma-separated)`;

function ContactsCSVInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Contacts CSV Format</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">{CONTACTS_CSV_INFO}</pre>
        <button onClick={onClose} className="mt-4 w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dim transition-colors">Got it</button>
      </div>
    </div>
  );
}
import { contacts, STATUS_META, calcRefiSavings, CURRENT_RATE, type LoanStatus } from "@/lib/data";

const STATUSES: LoanStatus[] = ["lead","pre-approval","application","processing","underwriting","clear-to-close","closed","lost"];

function StatusBadge({ status }: { status: LoanStatus }) {
  const meta = STATUS_META[status];
  return <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>;
}

function PriorityDot({ priority }: { priority?: string }) {
  const c = priority === "hot" ? "bg-red-500" : priority === "warm" ? "bg-orange-400" : "bg-gray-300";
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c}`} />;
}

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showCSVInfo, setShowCSVInfo] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${c.firstName} ${c.lastName} ${c.email} ${c.employer || ""}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.loanStatus === statusFilter;
    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    total: contacts.length,
    active: contacts.filter(c => !["closed","lost"].includes(c.loanStatus)).length,
    pipeline: contacts.filter(c => !["closed","lost","lead"].includes(c.loanStatus)).reduce((s,c) => s + (c.loanAmount||0), 0),
    refi: contacts.filter(c => c.currentRate && c.currentRate > CURRENT_RATE + 0.25).length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      {showCSVInfo && <ContactsCSVInfoModal onClose={() => setShowCSVInfo(false)} />}
      {showAddContact && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setShowAddContact(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Add New Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["First Name","firstName"],["Last Name","lastName"],["Email","email"],["Phone","phone"],["Employer","employer"],["City","city"]].map(([label,field]) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type="text" placeholder={label} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Lead Source</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
                  <option>Referral</option><option>Realtor Partner</option><option>Website</option><option>Social Media</option><option>Past Client</option><option>Cold Outreach</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddContact(false)} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dim transition-colors">Save Contact</button>
              <button onClick={() => setShowAddContact(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Contacts</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage your mortgage clients and leads</p>
        </div>
        <button onClick={() => setShowAddContact(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dim transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Contact
          </button>
          <button onClick={() => setShowCSVInfo(true)} className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors">
            <Info className="w-3.5 h-3.5" /> CSV Format
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload CSV
            <input ref={fileRef} type="file" accept=".csv" className="hidden" />
          </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", value: stats.total, color: "text-primary" },
          { label: "Active Files", value: stats.active, color: "text-blue" },
          { label: "Pipeline Value", value: `$${(stats.pipeline/1000000).toFixed(1)}M`, color: "text-green" },
          { label: "Refi Candidates", value: stats.refi, color: "text-orange" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <div className="text-xs text-text-muted mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Revenue Forecast — 2.5% LO comp */}
      {(() => {
        const pipelineRevenue = Math.round(stats.pipeline * 0.025);
        return (
          <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-text-primary">Pipeline Revenue Forecast</div>
                <div className="text-xs text-text-muted">Based on 2.5% LO comp · ${(stats.pipeline/1000).toFixed(0)}K active pipeline</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "50% Close Rate", pct: 0.5, color: "text-text-secondary", bg: "bg-gray-50" },
                { label: "75% Close Rate", pct: 0.75, color: "text-primary font-bold", bg: "bg-primary/5 border border-primary/20" },
                { label: "100% Close Rate", pct: 1.0, color: "text-green font-bold", bg: "bg-green/5 border border-green/20" },
              ].map(r => (
                <div key={r.label} className={`rounded-xl p-3 text-center ${r.bg}`}>
                  <div className="text-xs text-text-muted mb-1">{r.label}</div>
                  <div className={`text-xl ${r.color}`}>${Math.round(pipelineRevenue * r.pct).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
            className="w-full bg-white border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors shadow-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 shadow-sm">
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 shadow-sm">
          <option value="all">All Priority</option>
          <option value="hot">🔴 Hot</option>
          <option value="warm">🟠 Warm</option>
          <option value="cold">⚪ Cold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-hover">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Loan Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">Loan Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Rate</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Credit Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden lg:table-cell">Appraised Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden lg:table-cell">Employment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden xl:table-cell">Refi Savings</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Closed Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden xl:table-cell">Date of Birth</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden lg:table-cell">Last Contacted</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(c => {
              const refiSavings = c.currentRate ? calcRefiSavings(c.loanAmount||0, c.currentRate) : 0;
              return (
                <tr key={c.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/contacts/${c.id}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <PriorityDot priority={c.priority} />
                          <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                            {c.firstName} {c.lastName}
                          </span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">{c.leadSource}</div>
                      </div>
                    </Link>
                  </td>
                  {/* Loan Type */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-text-primary">{c.loanType || "—"}</div>
                    {refiSavings > 0 && (
                      <div className="text-xs text-green font-medium mt-0.5">+${refiSavings}/mo refi</div>
                    )}
                  </td>
                  {/* Loan Amount */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-sm font-semibold text-text-primary">
                      {c.loanAmount ? `$${(c.loanAmount/1000).toFixed(0)}K` : "—"}
                    </div>
                    {c.purchasePrice && <div className="text-xs text-text-muted">of ${(c.purchasePrice/1000).toFixed(0)}K</div>}
                  </td>
                  {/* Rate */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className={`text-sm font-semibold ${c.interestRate ? "text-text-primary" : c.currentRate ? "text-red" : "text-text-muted"}`}>
                      {c.interestRate ? `${c.interestRate}%` : c.currentRate ? `${c.currentRate}%` : "—"}
                    </div>
                    {c.currentRate && <div className="text-xs text-text-muted">current</div>}
                  </td>
                  {/* Credit Score */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className={`text-sm font-bold ${c.creditScore && c.creditScore >= 740 ? "text-green" : c.creditScore && c.creditScore >= 680 ? "text-primary" : c.creditScore ? "text-orange" : "text-text-muted"}`}>
                      {c.creditScore || "—"}
                    </div>
                    {c.creditScore && <div className="text-xs text-text-muted">{c.creditScore >= 740 ? "Excellent" : c.creditScore >= 700 ? "Good" : c.creditScore >= 660 ? "Fair" : "Low"}</div>}
                  </td>
                  {/* Appraised Value */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-sm font-semibold text-text-primary">
                      {c.purchasePrice ? `$${(c.purchasePrice/1000).toFixed(0)}K` : "—"}
                    </div>
                    {c.purchasePrice && c.loanAmount && (
                      <div className="text-xs text-text-muted">{(((c.purchasePrice - (c.downPayment||0))/c.purchasePrice)*100).toFixed(0)}% LTV</div>
                    )}
                  </td>
                  {/* Employment */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-sm text-text-secondary">{c.employer || "—"}</div>
                    <div className="text-xs text-text-muted">{c.employmentType || ""}{c.annualIncome ? ` · $${(c.annualIncome/1000).toFixed(0)}K/yr` : ""}</div>
                  </td>
                  {/* Refi Savings */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {c.currentRate && c.currentRate > CURRENT_RATE + 0.25 ? (
                      <div>
                        <div className="text-sm font-bold text-green">+${refiSavings}/mo</div>
                        <div className="text-xs text-text-muted">{c.currentRate}% → {CURRENT_RATE}%</div>
                        <div className="text-xs text-green">+${(refiSavings*12).toLocaleString()}/yr</div>
                      </div>
                    ) : c.currentRate ? (
                      <div className="text-xs text-text-muted">At market rate</div>
                    ) : (
                      <div className="text-xs text-text-muted">—</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.loanStatus} />
                  </td>
                  {/* Closed Date */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-sm text-text-secondary">{c.closedDate || "—"}</div>
                    {c.targetCloseDate && !c.closedDate && <div className="text-xs text-text-muted">Target: {c.targetCloseDate}</div>}
                  </td>
                  {/* Date of Birth */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="text-sm text-text-secondary">{c.dateOfBirth || "—"}</div>
                    {c.dateOfBirth && <div className="text-xs text-text-muted">Age {new Date().getFullYear() - new Date(c.dateOfBirth).getFullYear()}</div>}
                  </td>
                  {/* Last Contacted */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-sm text-text-secondary">{c.lastContactDate || "—"}</div>
                    {c.lastContactDate && (() => {
                      const days = Math.floor((Date.now() - new Date(c.lastContactDate).getTime()) / 86400000);
                      return <div className={`text-xs ${days > 7 ? "text-orange font-medium" : "text-text-muted"}`}>{days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`}</div>;
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <a href={`tel:${c.phone}`} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a href={`mailto:${c.email}`} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">No contacts found.</div>
        )}
      </div>
    </div>
  );
}
