"use client";
import { useState, useRef } from "react";
import { Search, Phone, Linkedin, Download, Upload, Info, X, Check, Filter, RefreshCw, ChevronDown } from "lucide-react";
import recruitsData from "@/lib/recruits.json";

interface Recruit {
  id: string; firstName: string; lastName: string; fullName: string;
  title: string; company: string; phone: string | null; linkedin: string | null;
  city: string; state: string; location: string; status: string; notes: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  new: "text-blue-600 bg-blue-50 border-blue-200",
  called: "text-amber-600 bg-amber-50 border-amber-200",
  texted: "text-purple-600 bg-purple-50 border-purple-200",
  interested: "text-green-600 bg-green-50 border-green-200",
  not_interested: "text-red-500 bg-red-50 border-red-200",
  hired: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

const CSV_FORMAT_INFO = `Required columns for Recruit CSV upload:
• First Name
• Last Name  
• Company Name (or Company)
• Job Title (or Title)
• Location
• LinkedIn Profile (optional)
• Mobile Number (optional)
• Status (optional: new/called/texted/interested/not_interested/hired)

Optional Clay.com format also supported — includes "Mobile Number (JSON) mobile Number" column.`;

function CSVInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">CSV Upload Format</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">{CSV_FORMAT_INFO}</pre>
        <button onClick={onClose} className="mt-4 w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dim transition-colors">Got it</button>
      </div>
    </div>
  );
}

function parseCSV(text: string): Recruit[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  
  const get = (row: string[], keys: string[]) => {
    for (const key of keys) {
      const idx = headers.findIndex(h => h.includes(key));
      if (idx >= 0 && row[idx]) return row[idx].replace(/^"|"$/g, '').trim();
    }
    return '';
  };

  return lines.slice(1).map((line, i) => {
    const row = line.split(',');
    const first = get(row, ['first name', 'firstname']);
    const last = get(row, ['last name', 'lastname']);
    const phone = get(row, ['mobile number (json) mobile', 'mobile number', 'phone', 'cell']);
    const location = get(row, ['location']);
    const parts = location.split(',');
    return {
      id: `csv-${i}`,
      firstName: first, lastName: last,
      fullName: get(row, ['full name']) || `${first} ${last}`,
      title: get(row, ['job title', 'title']),
      company: get(row, ['company name', 'company']),
      phone: phone || null,
      linkedin: get(row, ['linkedin']) || null,
      city: parts[0]?.trim() || '',
      state: parts[1]?.trim().replace(' United States','') || '',
      location, status: get(row, ['status']) || 'new', notes: null,
    };
  }).filter(r => r.firstName || r.lastName);
}

export default function RecruitPage() {
  const [recruits, setRecruits] = useState<Recruit[]>(recruitsData as Recruit[]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = recruits.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || [r.firstName,r.lastName,r.company,r.city].some(f => (f||"").toLowerCase().includes(q));
    const matchState = !stateFilter || r.state.includes(stateFilter);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchQ && matchState && matchStatus;
  });

  const withPhone = recruits.filter(r => r.phone).length;
  const contacted = recruits.filter(r => ["called","texted","interested","hired"].includes(r.status)).length;

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseCSV(ev.target?.result as string);
      if (parsed.length > 0) setRecruits(prev => [...parsed, ...prev]);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function exportCSV() {
    const h = ["First Name","Last Name","Title","Company","Phone","LinkedIn","City","State","Status","Notes"];
    const rows = filtered.map(r => [r.firstName,r.lastName,r.title||"",r.company||"",r.phone||"",r.linkedin||"",r.city||"",r.state||"",r.status,r.notes||""]);
    const csv = [h,...rows].map(row => row.map(v => `"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download = "recruits.csv"; a.click();
  }

  function updateStatus(id: string, status: string) {
    setUpdating(id);
    setRecruits(prev => prev.map(r => r.id === id ? {...r, status} : r));
    setTimeout(() => { setUpdating(null); setOpenMenu(null); }, 300);
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      {showInfo && <CSVInfoModal onClose={() => setShowInfo(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Recruit</h1>
          <p className="text-sm text-text-muted mt-0.5">Loan officer recruiting pipeline · {recruits.length.toLocaleString()} contacts · {withPhone} with phone</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowInfo(true)} className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors">
            <Info className="w-3.5 h-3.5" /> CSV Format
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload CSV
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
          </label>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border text-text-muted text-xs rounded-lg hover:text-text-primary transition-colors">
            <Download className="w-3.5 h-3.5" /> Export ({filtered.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: recruits.length, color: "text-primary" },
          { label: "With Phone", value: withPhone, color: "text-green" },
          { label: "Contacted", value: contacted, color: "text-gold" },
          { label: "Hired", value: recruits.filter(r=>r.status==="hired").length, color: "text-green" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <div className="text-xs text-text-muted mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, company, city..."
            className="w-full bg-white border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 shadow-sm" />
        </div>
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
          className="bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 shadow-sm">
          <option value="">All States</option>
          <option value="Utah">Utah</option><option value="Idaho">Idaho</option>
          <option value="Wyoming">Wyoming</option><option value="Florida">Florida</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 shadow-sm">
          <option value="">All Status</option>
          <option value="new">New</option><option value="called">Called</option>
          <option value="texted">Texted</option><option value="interested">Interested</option>
          <option value="not_interested">Not Interested</option><option value="hired">Hired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50/80">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Recruit</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Contact</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.slice(0, 100).map(r => (
              <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {r.firstName?.[0]||"?"}{r.lastName?.[0]||""}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{r.firstName} {r.lastName}</div>
                      <div className="text-xs text-text-muted">{r.title || "Loan Officer"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="text-sm text-text-secondary">{r.company || "—"}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-xs text-text-muted">{r.city}{r.city && r.state ? ", " : ""}{r.state}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[r.status] || STATUS_STYLES.new}`}>
                    {r.status.replace("_"," ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {r.phone ? (
                      <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-xs text-green hover:underline">
                        <Phone className="w-3.5 h-3.5" /> {r.phone.replace('+1','')}
                      </a>
                    ) : <span className="text-xs text-text-muted">No phone</span>}
                    {r.linkedin && (
                      <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue hover:opacity-80">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="relative">
                    <button onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {openMenu === r.id && (
                      <div className="absolute right-0 top-8 z-10 w-40 bg-white border border-border rounded-xl shadow-xl py-1">
                        {["called","texted","interested","not_interested","hired"].map(s => (
                          <button key={s} onClick={() => updateStatus(r.id, s)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 capitalize ${r.status === s ? "text-primary font-semibold" : "text-text-secondary"}`}>
                            {updating === r.id ? "..." : s.replace("_"," ")}
                          </button>
                        ))}
                        <div className="border-t border-border my-1" />
                        <button onClick={() => setOpenMenu(null)} className="w-full text-left px-3 py-2 text-xs text-text-muted hover:bg-gray-50">Cancel</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <div className="px-4 py-3 border-t border-border text-xs text-text-muted text-center">
            Showing 100 of {filtered.length.toLocaleString()} — use filters to narrow down
          </div>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">No recruits found.</div>
        )}
      </div>
    </div>
  );
}
