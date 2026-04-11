"use client";
import Link from "next/link";
import { useState } from "react";
import { Zap, Phone, Mail, Copy, Check, TrendingDown } from "lucide-react";
import { contacts, calcRefiSavings, CURRENT_RATE } from "@/lib/data";

const refiCandidates = contacts
  .filter(c => c.currentRate && c.currentRate > CURRENT_RATE + 0.25)
  .map(c => ({ ...c, savings: calcRefiSavings(c.loanAmount || 0, c.currentRate!) }))
  .sort((a, b) => b.savings - a.savings);

const totalSavings = refiCandidates.reduce((s, c) => s + c.savings, 0);

function CopyPitchBtn({ contact }: { contact: typeof refiCandidates[0] }) {
  const [copied, setCopied] = useState(false);
  const pitch = `Hi ${contact.firstName}! Josh here from Rockwell Mortgage. Quick thought — with rates at ${CURRENT_RATE}% today, you could save $${contact.savings}/month on your current loan. That's $${(contact.savings * 12).toLocaleString()}/year in savings. Want me to run a full refi analysis? Takes 5 minutes. — Josh`;
  return (
    <button onClick={() => { navigator.clipboard.writeText(pitch); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${copied ? "bg-green/10 text-green border-green/20" : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"}`}>
      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Pitch</>}
    </button>
  );
}

export default function RefiAlertsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Refi Alerts</h1>
        <p className="text-sm text-text-muted mt-0.5">Clients who could save at today's rate of {CURRENT_RATE}%</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-text-muted mb-1">Candidates</div>
          <div className="text-2xl font-bold text-primary">{refiCandidates.length}</div>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-text-muted mb-1">Avg Savings/mo</div>
          <div className="text-2xl font-bold text-green">${refiCandidates.length ? Math.round(totalSavings / refiCandidates.length) : 0}</div>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs text-text-muted mb-1">Total/mo</div>
          <div className="text-2xl font-bold text-green">${totalSavings.toLocaleString()}</div>
        </div>
      </div>

      {/* Market update CTA */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-blue-700">Send Market Update to All {refiCandidates.length} Candidates</div>
          <div className="text-sm text-blue-600/80 mt-0.5">Show each client their exact savings at today's {CURRENT_RATE}% rate.</div>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Compose Market Update Email
          </button>
        </div>
      </div>

      {/* Candidates list */}
      <div className="space-y-3">
        {refiCandidates.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">No refi candidates at current rates.</div>
        ) : refiCandidates.map(c => (
          <div key={c.id} className="bg-white border border-border rounded-xl p-4 shadow-sm hover:border-green/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {c.firstName[0]}{c.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Link href={`/contacts/${c.id}`} className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                    {c.firstName} {c.lastName}
                  </Link>
                  <span className="text-base font-bold text-green">+${c.savings}/mo savings</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <TrendingDown className="w-3 h-3 text-green" />
                  <span>Closed at <span className="text-red-500 font-medium">{c.currentRate}%</span> → today <span className="text-green font-medium">{CURRENT_RATE}%</span> · ${((c.loanAmount||0)/1000).toFixed(0)}K loan</span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  Annual savings: <span className="text-green font-medium">${(c.savings * 12).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                    <Mail className="w-3 h-3" /> Email
                  </a>
                  <CopyPitchBtn contact={c} />
                  <Link href={`/contacts/${c.id}`} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
