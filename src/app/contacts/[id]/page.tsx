"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Phone, Mail, MapPin, Edit2, Star, MoreHorizontal, Check, Copy, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { contacts, STATUS_META, calcMonthly, calcRefiSavings, CURRENT_RATE } from "@/lib/data";

function FieldRow({ label, value, highlight }: { label: string; value?: string | number | null; highlight?: string }) {
  if (!value && value !== 0) return (
    <div className="py-2.5 grid grid-cols-5 gap-2 border-b border-border/50 last:border-0">
      <div className="col-span-2 text-xs font-medium text-text-muted">{label}</div>
      <div className="col-span-3 text-sm text-text-muted">—</div>
    </div>
  );
  return (
    <div className="py-2.5 grid grid-cols-5 gap-2 border-b border-border/50 last:border-0 group hover:bg-primary/5 -mx-4 px-4 rounded transition-colors cursor-pointer">
      <div className="col-span-2 text-xs font-medium text-text-muted self-center">{label}</div>
      <div className={`col-span-3 text-sm font-medium ${highlight || "text-text-primary"}`}>{value}</div>
    </div>
  );
}

function Section({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50/80 ${collapsible ? "cursor-pointer" : ""}`} onClick={() => collapsible && setOpen(!open)}>
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
        <div className="flex items-center gap-2">
          <button className="p-1 text-text-muted hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
          {collapsible && (open ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />)}
        </div>
      </div>
      {(!collapsible || open) && <div className="px-4 py-1">{children}</div>}
    </div>
  );
}

function ActivityItem({ icon, title, subtitle, time, color = "bg-primary" }: { icon: string; title: string; subtitle: string; time: string; color?: string }) {
  return (
    <div className="flex gap-3 py-3 border-b border-border/50 last:border-0">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{title}</div>
        <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>
      </div>
      <div className="text-xs text-text-muted flex-shrink-0">{time}</div>
    </div>
  );
}

export default function ContactDetailPage() {
  const { id } = useParams();
  const c = contacts.find(x => x.id === id);
  const [copied, setCopied] = useState(false);

  if (!c) return (
    <div className="p-6">
      <Link href="/contacts" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <p className="text-text-muted">Contact not found.</p>
    </div>
  );

  const statusMeta = STATUS_META[c.loanStatus];
  const monthlyPayment = c.loanAmount && c.interestRate ? calcMonthly(c.loanAmount, c.interestRate) : null;
  const refiSavings = c.currentRate ? calcRefiSavings(c.loanAmount||0, c.currentRate) : 0;
  const downPct = c.purchasePrice && c.downPayment ? ((c.downPayment/c.purchasePrice)*100).toFixed(1) : null;
  const loRevenue = Math.round((c.loanAmount||0) * 0.025);

  const refiPitch = refiSavings > 0
    ? `Hi ${c.firstName}! Josh at Rockwell Mortgage. Just ran your numbers — at today's ${CURRENT_RATE}%, you could save $${refiSavings}/month ($${(refiSavings*12).toLocaleString()}/yr). Want me to run a full refi analysis? Takes 5 min. — Josh`
    : "";

  return (
    <div className="animate-fade-in">
      {/* Salesforce-style header bar */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <Link href="/contacts" className="text-sm text-primary hover:text-primary-dim flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Contacts
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-sm text-text-secondary">{c.firstName} {c.lastName}</span>
      </div>

      {/* Hero / Record Header — Salesforce style */}
      <div className="bg-white border-b border-border px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm">
            {c.firstName[0]}{c.lastName[0]}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-text-primary">{c.firstName} {c.lastName}</h1>
              <Star className="w-4 h-4 text-text-muted hover:text-yellow-400 cursor-pointer transition-colors" />
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: statusMeta.color, backgroundColor: statusMeta.bg }}>
                {statusMeta.label}
              </span>
              {c.priority === "hot" && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">🔴 Hot Priority</span>}
              {refiSavings > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green/10 text-green">💰 Refi Candidate</span>}
            </div>

            {/* Key fields inline — Salesforce compact view */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary mt-1">
              {c.loanType && <span className="flex items-center gap-1"><span className="text-xs text-text-muted">Loan Type</span> <span className="font-medium text-text-primary">{c.loanType}</span></span>}
              {c.loanAmount && <span className="flex items-center gap-1"><span className="text-xs text-text-muted">Amount</span> <span className="font-medium text-text-primary">${c.loanAmount.toLocaleString()}</span></span>}
              {c.creditScore && <span className="flex items-center gap-1"><span className="text-xs text-text-muted">FICO</span> <span className="font-medium text-text-primary">{c.creditScore}</span></span>}
              {c.assignedLO && <span className="flex items-center gap-1"><span className="text-xs text-text-muted">LO</span> <span className="font-medium text-text-primary">{c.assignedLO}</span></span>}
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-4 mt-3">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dim transition-colors">
                <Phone className="w-3.5 h-3.5" /> {c.phone}
              </a>
              {c.mobilePhone && <a href={`tel:${c.mobilePhone}`} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dim transition-colors">
                <Phone className="w-3.5 h-3.5" /> {c.mobilePhone} <span className="text-xs text-text-muted">mobile</span>
              </a>}
              <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dim transition-colors">
                <Mail className="w-3.5 h-3.5" /> {c.email}
              </a>
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <MapPin className="w-3.5 h-3.5" /> {c.city}, {c.state}
              </span>
            </div>
          </div>

          {/* Action buttons — Salesforce style */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dim transition-colors shadow-sm">New Task</button>
            <button className="px-4 py-2 bg-white border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface-hover transition-colors shadow-sm">Log Call</button>
            <button className="px-4 py-2 bg-white border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface-hover transition-colors shadow-sm">Send Email</button>
            <button className="p-2 bg-white border border-border text-text-muted rounded-lg hover:bg-surface-hover transition-colors shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Tag row */}
        <div className="flex flex-wrap gap-2 mt-4">
          {c.tags.map(t => (
            <span key={t} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium border border-primary/20">{t}</span>
          ))}
          <button className="text-xs px-2.5 py-1 text-text-muted border border-dashed border-border rounded-full hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> Tag
          </button>
        </div>
      </div>

      {/* Main content — 2 column like Salesforce */}
      <div className="flex flex-col md:flex-row gap-0 md:h-full">
        {/* Left sidebar — Activity */}
        <div className="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-white p-4 space-y-4 overflow-y-auto" style={{minHeight:'calc(100vh - 200px)'}}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-primary">Activity</h3>
              <button className="text-xs text-primary hover:text-primary-dim">+ Log</button>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover rounded-lg transition-colors text-left">
                <Phone className="w-4 h-4 text-text-muted" /> Log a Call
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover rounded-lg transition-colors text-left">
                <Mail className="w-4 h-4 text-text-muted" /> Send Email
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Past Activity</div>
            <ActivityItem icon="📞" title="Called — left voicemail" subtitle="Discussed rate options, follow up next week" time="Mar 27" color="bg-blue-500" />
            <ActivityItem icon="📧" title="Email sent — rate update" subtitle="Current rates: 6.49% on 30yr fixed" time="Mar 20" color="bg-purple-500" />
            <ActivityItem icon="📋" title="Application submitted" subtitle="Docs received, sent to processing" time="Mar 10" color="bg-green-500" />
            <ActivityItem icon="🤝" title="First contact" subtitle="Referral from Dave Carter — Realtor" time="Feb 28" color="bg-orange-500" />
          </div>

          {/* Lead Source */}
          <div className="pt-4 border-t border-border">
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Lead Source</div>
            <div className="text-sm font-medium text-text-primary">{c.leadSource}</div>
            {c.realtorPartner && <div className="text-xs text-text-muted mt-1">Partner: {c.realtorPartner}</div>}
          </div>
        </div>

        {/* Main detail area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-background">

          {/* Refi Banner */}
          {refiSavings > 0 && (
            <div className="bg-green/5 border border-green/20 rounded-lg p-4 flex items-start gap-4 flex-wrap">
              <div className="flex-1">
                <div className="text-sm font-bold text-green mb-1">💰 Refi Opportunity — Save ${refiSavings}/month</div>
                <div className="text-xs text-text-secondary">Closed at {c.currentRate}% · Today's rate: {CURRENT_RATE}% · Annual savings: ${(refiSavings*12).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(refiPitch); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green text-white text-xs font-medium rounded-lg hover:bg-green/90 transition-colors">
                  {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Pitch</>}
                </button>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <Section title="Contact Information">
            <FieldRow label="First Name" value={c.firstName} />
            <FieldRow label="Last Name" value={c.lastName} />
            <FieldRow label="Email" value={c.email} highlight="text-primary" />
            <FieldRow label="Phone" value={c.phone} highlight="text-primary" />
            <FieldRow label="Mobile" value={c.mobilePhone} highlight="text-primary" />
            <FieldRow label="Work Phone" value={c.workPhone} highlight="text-primary" />
            <FieldRow label="Date of Birth" value={c.dateOfBirth} />
            <FieldRow label="SSN (Last 4)" value={c.ssn ? `***-**-${c.ssn}` : null} />
            <FieldRow label="Mailing Address" value={c.currentAddress} />
            <FieldRow label="City" value={c.city} />
            <FieldRow label="State" value={c.state} />
            <FieldRow label="Zip Code" value={c.zip} />
          </Section>

          {/* Loan Information */}
          <Section title="Loan Information">
            <FieldRow label="Loan Status" value={statusMeta.label} />
            <FieldRow label="Loan Type" value={c.loanType} />
            <FieldRow label="Loan Amount" value={c.loanAmount ? `$${c.loanAmount.toLocaleString()}` : null} />
            <FieldRow label="Purchase Price" value={c.purchasePrice ? `$${c.purchasePrice.toLocaleString()}` : null} />
            <FieldRow label="Down Payment" value={c.downPayment ? `$${c.downPayment.toLocaleString()}${downPct ? ` (${downPct}%)` : ""}` : null} />
            <FieldRow label="Interest Rate" value={c.interestRate ? `${c.interestRate}%` : null} />
            <FieldRow label="Est. Monthly Payment" value={monthlyPayment ? `$${Math.round(monthlyPayment).toLocaleString()}/mo` : null} highlight="text-primary" />
            <FieldRow label="Current Rate (Refi)" value={c.currentRate ? `${c.currentRate}%` : null} />
            <FieldRow label="Property Type" value={c.propertyType} />
            <FieldRow label="Property Address" value={c.propertyAddress} />
          </Section>

          {/* Credit & Financials */}
          <Section title="Credit & Financial Profile">
            <FieldRow label="Credit Score (FICO)" value={c.creditScore ? `${c.creditScore} ${c.creditScore >= 740 ? "⭐ Excellent" : c.creditScore >= 700 ? "✅ Good" : c.creditScore >= 660 ? "🟡 Fair" : "🔴 Needs Work"}` : null} />
            <FieldRow label="DTI Ratio" value={c.dti ? `${c.dti}% ${c.dti <= 36 ? "✅ Strong" : c.dti <= 43 ? "🟡 Acceptable" : "🔴 High"}` : null} />
            <FieldRow label="Annual Income" value={c.annualIncome ? `$${c.annualIncome.toLocaleString()}` : null} />
            <FieldRow label="Monthly Debts" value={c.monthlyDebts ? `$${c.monthlyDebts.toLocaleString()}` : null} />
            <FieldRow label="Total Assets" value={c.totalAssets ? `$${c.totalAssets.toLocaleString()}` : null} />
          </Section>

          {/* Employment */}
          <Section title="Employment Information">
            <FieldRow label="Employer" value={c.employer} />
            <FieldRow label="Job Title" value={c.jobTitle} />
            <FieldRow label="Employment Type" value={c.employmentType} />
            <FieldRow label="Years Employed" value={c.yearsEmployed ? `${c.yearsEmployed} years` : null} />
          </Section>

          {/* Key Dates */}
          <Section title="Key Dates">
            <FieldRow label="Application Date" value={c.applicationDate} />
            <FieldRow label="Target Close Date" value={c.targetCloseDate} highlight={c.targetCloseDate ? "text-primary font-semibold" : undefined} />
            <FieldRow label="Last Contact Date" value={c.lastContactDate} />
            <FieldRow label="Closed Date" value={c.closedDate} highlight="text-green" />
          </Section>

          {/* LO Revenue */}
          <Section title="LO Revenue Estimate (2.5% comp)" collapsible>
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="text-center p-4 bg-green/5 border border-green/20 rounded-xl">
                <div className="text-xs text-text-muted mb-1">LO Revenue at Close (100%)</div>
                <div className="text-3xl font-bold text-green">${loRevenue.toLocaleString()}</div>
                <div className="text-xs text-text-muted mt-1">2.5% comp on ${(loRevenue/0.025/1000).toFixed(0)}K loan</div>
              </div>
            </div>
          </Section>

          {/* Notes */}
          {c.notes && (
            <Section title="Notes">
              <p className="text-sm text-text-secondary leading-relaxed py-2">{c.notes}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
