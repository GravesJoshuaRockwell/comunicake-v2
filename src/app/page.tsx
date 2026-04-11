"use client";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, Calendar, ArrowRight, Zap } from "lucide-react";
import { contacts, STATUS_META, calcRefiSavings, CURRENT_RATE } from "@/lib/data";

const pipeline = contacts.filter(c => !["closed","lost"].includes(c.loanStatus));
const pipelineValue = pipeline.reduce((s,c) => s + (c.loanAmount||0), 0);
const refiCandidates = contacts.filter(c => c.currentRate && c.currentRate > CURRENT_RATE + 0.25);
const closingThisMonth = contacts.filter(c => c.targetCloseDate?.startsWith("2026-04")).length;

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-0.5">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})} · Rockwell Mortgage</p>
      </div>

      {refiCandidates.length > 0 && (
        <Link href="/contacts" className="flex items-center gap-3 p-4 bg-green/5 border border-green/20 rounded-xl hover:bg-green/10 transition-colors">
          <Zap className="w-4 h-4 text-green flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-green">Refi Opportunity — {refiCandidates.length} clients</div>
            <div className="text-sm text-text-secondary mt-0.5">{refiCandidates.map(c=>`${c.firstName} ${c.lastName}`).join(", ")} could save at today's {CURRENT_RATE}% rate.</div>
          </div>
          <ArrowRight className="w-4 h-4 text-green flex-shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", value: contacts.length, icon: Users, color: "text-primary", href: "/contacts" },
          { label: "Pipeline Value", value: `$${(pipelineValue/1000000).toFixed(1)}M`, icon: DollarSign, color: "text-green", href: "/pipeline" },
          { label: "Closing This Month", value: closingThisMonth, icon: Calendar, color: "text-orange", href: "/contacts" },
          { label: "Refi Candidates", value: refiCandidates.length, icon: TrendingUp, color: "text-purple", href: "/contacts" },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 ${color}`} /><span className="text-xs text-text-muted">{label}</span></div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
          </Link>
        ))}
      </div>

      {/* Recent contacts */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Recent Contacts</h2>
          <Link href="/contacts" className="text-xs text-primary hover:text-primary-dim flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="divide-y divide-border">
          {contacts.slice(0,5).map(c => {
            const meta = STATUS_META[c.loanStatus];
            return (
              <Link key={c.id} href={`/contacts/${c.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors group">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{c.firstName} {c.lastName}</div>
                  <div className="text-xs text-text-muted">{c.loanType} · ${((c.loanAmount||0)/1000).toFixed(0)}K · {c.leadSource}</div>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0" style={{ color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
