"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, TrendingDown, DollarSign, Calculator, Home, User, Zap, Copy, Check, Phone, Mail } from "lucide-react";

function calcPayment(loan: number, rate: number, years = 30) {
  const r = rate / 100 / 12, n = years * 12;
  if (r === 0) return loan / n;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const CURRENT_RATE_30 = 6.49;
const CURRENT_RATE_15 = 5.82;

interface FormData {
  goalType: string;
  currentLoanBalance: string;
  currentRate: string;
  currentMonthlyPayment: string;
  propertyValue: string;
  propertyType: string;
  creditScore: string;
  employmentType: string;
  annualIncome: string;
  cashOutAmount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Results {
  monthly30: number;
  annual30: number;
  newPayment30: number;
  newPayment15: number;
  newRate30: number;
  newRate15: number;
  breakEven: number | null;
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? "bg-primary" : i === step - 1 ? "bg-primary" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${copied ? "bg-green-50 text-green-600 border-green-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"}`}>
      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Pitch</>}
    </button>
  );
}

export default function RefiReadyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [form, setForm] = useState<FormData>({
    goalType: "", currentLoanBalance: "", currentRate: "", currentMonthlyPayment: "",
    propertyValue: "", propertyType: "", creditScore: "", employmentType: "",
    annualIncome: "", cashOutAmount: "", firstName: "", lastName: "", email: "", phone: "",
  });

  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }));
  const TOTAL_STEPS = 4;

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/refi-quote", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.savings);
        setStep(5);
      }
    } catch { /* calculate locally if API fails */
      const loan = parseFloat(form.currentLoanBalance) || 0;
      const oldPayment = parseFloat(form.currentMonthlyPayment) || calcPayment(loan, parseFloat(form.currentRate) || 7.5, 30);
      const newPayment30 = calcPayment(loan, CURRENT_RATE_30, 30);
      const newPayment15 = calcPayment(loan, CURRENT_RATE_15, 15);
      const monthly30 = Math.round(oldPayment - newPayment30);
      setResults({
        monthly30, annual30: monthly30 * 12,
        newPayment30: Math.round(newPayment30), newPayment15: Math.round(newPayment15),
        newRate30: CURRENT_RATE_30, newRate15: CURRENT_RATE_15,
        breakEven: monthly30 > 0 ? Math.round((loan * 0.025) / monthly30) : null,
      });
      setStep(5);
    }
    setLoading(false);
  }

  const pitchText = results ? `Hi ${form.firstName}! Josh here from Rockwell Mortgage. Just ran your numbers — at today's rate of ${CURRENT_RATE_30}%, you could save $${results.monthly30}/month ($${results.annual30.toLocaleString()}/year) on your current loan. ${results.breakEven ? `You'd break even in just ${results.breakEven} months.` : ""} Want me to run a full refi analysis? Takes 5 minutes. — Josh` : "";

  const btnClass = "w-full py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dim transition-colors disabled:opacity-50";
  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-white";
  const selectClass = inputClass;
  const optionBtnClass = (active: boolean) => `w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all ${active ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-gray-50"}`;

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">Refi Ready</h1>
          </div>
          <p className="text-sm text-text-muted">Should you refinance? Find out in 2 minutes — get your break-even point, monthly savings, and PDF summary.</p>
        </div>

        {step < 5 && <ProgressBar step={step} total={TOTAL_STEPS} />}

        <div className="bg-white border border-border rounded-2xl shadow-sm p-6">

          {/* STEP 1 — GOAL */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><Home className="w-4 h-4 text-primary" /><h2 className="text-base font-bold text-gray-900">What's your refinance goal?</h2></div>
                <p className="text-sm text-gray-500">Select the outcome that matters most to you</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { key: "lower_payment", label: "💰 Lower My Monthly Payment", sub: "Reduce what I pay each month" },
                  { key: "cash_out", label: "💵 Get Cash Out", sub: "Access equity for home improvements, debt, or other needs" },
                  { key: "shorter_term", label: "⚡ Pay Off Faster", sub: "Move from 30yr to 15yr and save on interest" },
                  { key: "lower_rate", label: "📉 Lock a Better Rate", sub: "My rate is high and I want to lock in today's rates" },
                ].map(o => (
                  <button key={o.key} onClick={() => set("goalType", o.key)} className={optionBtnClass(form.goalType === o.key)}>
                    <div>{o.label}</div>
                    <div className={`text-xs mt-0.5 ${form.goalType === o.key ? "text-primary/70" : "text-gray-400"}`}>{o.sub}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!form.goalType} className={btnClass}>
                Continue <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {/* STEP 2 — CURRENT LOAN */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-primary" /><h2 className="text-base font-bold text-gray-900">Your Current Loan</h2></div>
                <p className="text-sm text-gray-500">We'll use this to calculate your exact savings</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Loan Balance ($)</label>
                  <input type="number" value={form.currentLoanBalance} onChange={e => set("currentLoanBalance", e.target.value)} placeholder="450,000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Interest Rate (%)</label>
                  <input type="number" step="0.01" value={form.currentRate} onChange={e => set("currentRate", e.target.value)} placeholder="7.25" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Monthly Payment ($)</label>
                  <input type="number" value={form.currentMonthlyPayment} onChange={e => set("currentMonthlyPayment", e.target.value)} placeholder="3,074" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Estimated Property Value ($)</label>
                  <input type="number" value={form.propertyValue} onChange={e => set("propertyValue", e.target.value)} placeholder="580,000" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Property Type</label>
                  <select value={form.propertyType} onChange={e => set("propertyType", e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    <option>Single Family</option><option>Condo</option><option>Townhouse</option><option>Multi-Family</option>
                  </select>
                </div>
                {form.goalType === "cash_out" && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Cash-Out Amount Desired ($)</label>
                    <input type="number" value={form.cashOutAmount} onChange={e => set("cashOutAmount", e.target.value)} placeholder="50,000" className={inputClass} />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!form.currentLoanBalance || !form.currentRate} className={btnClass + " flex-1"}>
                  Continue <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — PROFILE */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><User className="w-4 h-4 text-primary" /><h2 className="text-base font-bold text-gray-900">Your Financial Profile</h2></div>
                <p className="text-sm text-gray-500">Helps us show you the most accurate rates</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Credit Score Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[["760+","Excellent"],["720-759","Very Good"],["680-719","Good"],["640-679","Fair"],["Below 640","Needs Work"]].map(([score, label]) => (
                    <button key={score} onClick={() => set("creditScore", score)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all text-center ${form.creditScore === score ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-primary/30"}`}>
                      <div className="font-bold">{score}</div>
                      <div className="opacity-70">{label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Employment Type</label>
                  <select value={form.employmentType} onChange={e => set("employmentType", e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    <option>W-2 Employee</option><option>Self-Employed</option><option>1099 Contractor</option><option>Retired</option><option>Military</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Annual Income ($)</label>
                  <input type="number" value={form.annualIncome} onChange={e => set("annualIncome", e.target.value)} placeholder="120,000" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(4)} disabled={!form.creditScore} className={btnClass + " flex-1"}>
                  Continue <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — CONTACT */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-primary" /><h2 className="text-base font-bold text-gray-900">Get Your Results</h2></div>
                <p className="text-sm text-gray-500">We'll show your savings instantly and send a full PDF summary</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name</label>
                  <input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Josh" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                  <input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Graves" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(801) 555-0000" className={inputClass} />
                </div>
              </div>
              <p className="text-xs text-gray-400">🔒 256-bit SSL · No credit pull · Results in seconds</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={submit} disabled={loading || (!form.email && !form.phone)}
                  className={btnClass + " flex-1 flex items-center justify-center gap-2"}>
                  {loading ? "Calculating..." : <><Calculator className="w-4 h-4" /> See My Savings</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — RESULTS */}
          {step === 5 && results && (
            <div className="space-y-5">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-900">Your Refi Analysis, {form.firstName}!</h2>
                <p className="text-sm text-gray-500 mt-1">Based on today's rates and your loan details</p>
              </div>

              {/* Big savings number */}
              {results.monthly30 > 0 ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Monthly Savings</div>
                  <div className="text-5xl font-bold text-green-600">+${results.monthly30.toLocaleString()}</div>
                  <div className="text-sm text-green-600/80 mt-1">per month · ${results.annual30.toLocaleString()}/year</div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
                  <div className="text-sm font-semibold text-amber-700">Rate is already competitive — let&apos;s talk options</div>
                </div>
              )}

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-xs text-red-500 font-medium mb-1">Current</div>
                  <div className="text-xl font-bold text-red-600">${parseFloat(form.currentMonthlyPayment||"0").toLocaleString()}/mo</div>
                  <div className="text-xs text-red-400">@ {form.currentRate}%</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-xs text-green-600 font-medium mb-1">New (30yr)</div>
                  <div className="text-xl font-bold text-green-600">${results.newPayment30.toLocaleString()}/mo</div>
                  <div className="text-xs text-green-500">@ {results.newRate30}%</div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
                {results.breakEven && <div className="flex justify-between text-sm"><span className="text-gray-600">Break-even point</span><span className="font-semibold text-gray-900">{results.breakEven} months</span></div>}
                <div className="flex justify-between text-sm"><span className="text-gray-600">15yr option</span><span className="font-semibold text-gray-900">${results.newPayment15.toLocaleString()}/mo @ {results.newRate15}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">5-year savings</span><span className="font-semibold text-green-600">${(results.annual30 * 5).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">10-year savings</span><span className="font-semibold text-green-600">${(results.annual30 * 10).toLocaleString()}</span></div>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                <div className="text-sm font-semibold text-primary">Ready to lock this rate?</div>
                <p className="text-xs text-gray-600">Josh Graves · Rockwell Mortgage · NMLS #2413381 · Same-day pre-approvals · 21-day closes</p>
                <div className="flex gap-2 flex-wrap">
                  {pitchText && <CopyBtn text={pitchText} />}
                  <a href="tel:+18013808891" className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dim transition-colors">
                    <Phone className="w-4 h-4" /> Call Josh
                  </a>
                  <a href="mailto:josh@rockwellmtg.com" className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </div>
              </div>

              <button onClick={() => { setStep(1); setResults(null); setForm({ goalType:"",currentLoanBalance:"",currentRate:"",currentMonthlyPayment:"",propertyValue:"",propertyType:"",creditScore:"",employmentType:"",annualIncome:"",cashOutAmount:"",firstName:"",lastName:"",email:"",phone:"" }); }}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                Start New Calculation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
