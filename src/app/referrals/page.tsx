"use client";
import { contacts } from "@/lib/data";

const COLORS = ["#7c3aed","#3b82f6","#10b981","#f97316","#eab308","#ef4444","#a78bfa"];

export default function ReferralsPage() {
  const bySource: Record<string, typeof contacts> = {};
  contacts.forEach(c => {
    const key = c.leadSource;
    if (!bySource[key]) bySource[key] = [];
    bySource[key].push(c);
  });

  const sorted = Object.entries(bySource).sort((a, b) => b[1].length - a[1].length);
  const total = contacts.length;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Referral Tracking</h1>
        <p className="text-sm text-text-muted mt-0.5">Where your clients are coming from</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Source Breakdown</h2>
        <div className="space-y-3">
          {sorted.map(([source, sourceClients], i) => {
            const pct = (sourceClients.length / total) * 100;
            const color = COLORS[i % COLORS.length];
            return (
              <div key={source}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary font-medium">{source}</span>
                  <span className="text-text-muted">{sourceClients.length} client{sourceClients.length !== 1 ? "s" : ""} · {pct.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map(([source, sourceClients], i) => {
          const volume = sourceClients.reduce((s, c) => s + (c.loanAmount || 0), 0);
          const color = COLORS[i % COLORS.length];
          return (
            <div key={source} className="bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-semibold text-text-primary">{source}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-text-muted">Clients</div>
                  <div className="text-xl font-bold text-text-primary mt-0.5">{sourceClients.length}</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted">Volume</div>
                  <div className="text-xl font-bold text-text-primary mt-0.5">${(volume/1000).toFixed(0)}K</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {sourceClients.map(c => (
                  <div key={c.id} className="text-xs text-text-muted truncate">· {c.firstName} {c.lastName}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
