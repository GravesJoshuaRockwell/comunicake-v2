"use client";
import Link from "next/link";
import { contacts, STATUS_META, PIPELINE_STAGES, type LoanStatus } from "@/lib/data";

export default function PipelinePage() {
  const stages: LoanStatus[] = ["lead","pre-approval","application","processing","underwriting","clear-to-close"];
  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-text-primary">Pipeline</h1><p className="text-sm text-text-muted mt-0.5">Track every loan from lead to close</p></div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map(stage => {
          const meta = STATUS_META[stage];
          const stageContacts = contacts.filter(c => c.loanStatus === stage);
          const volume = stageContacts.reduce((s,c) => s+(c.loanAmount||0),0);
          return (
            <div key={stage} className="flex-shrink-0 w-64">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{color:meta.color,backgroundColor:meta.bg}}>{meta.label}</span>
                  <div className="text-xs text-text-muted mt-1">${(volume/1000).toFixed(0)}K</div>
                </div>
                <span className="text-xs font-bold text-text-secondary bg-surface-hover px-2 py-0.5 rounded-full">{stageContacts.length}</span>
              </div>
              <div className="space-y-2">
                {stageContacts.length === 0 ? (
                  <div className="bg-white border border-dashed border-border rounded-xl p-4 text-center text-xs text-text-muted">No contacts</div>
                ) : stageContacts.map(c => (
                  <Link key={c.id} href={`/contacts/${c.id}`} className="block bg-white border border-border rounded-xl p-3.5 hover:border-primary/30 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{c.firstName[0]}{c.lastName[0]}</div>
                      <div className="text-sm font-medium text-text-primary truncate">{c.firstName} {c.lastName}</div>
                    </div>
                    <div className="text-xs text-text-muted">{c.loanType} · ${((c.loanAmount||0)/1000).toFixed(0)}K</div>
                    {c.targetCloseDate && <div className="text-xs text-text-muted mt-1">Close: {c.targetCloseDate}</div>}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
