import { NextRequest, NextResponse } from "next/server";

const RESEND_KEY = "re_imBuMfwC_Goeec6vJnn2PwowZhsXf8GAD";
const NOTIFY = "josh@rockwellmtg.com";
const SUPABASE_URL = "https://evyrrqanqwlamkdgwokb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eXJycWFucXdsYW1rZGd3b2tiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5NzAyNywiZXhwIjoyMDkwMzczMDI3fQ.KEkdR4NNNZrDSmcE_2ogZ-M3seyNKtWOead68ypAWYc";
const BASE_URL = "https://v0-comunicake-mortgage.vercel.app";

function calcPayment(loan: number, rate: number, years = 30) {
  const r = rate / 100 / 12, n = years * 12;
  if (r === 0) return loan / n;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, phone,
      currentLoanBalance, currentRate, currentMonthlyPayment,
      propertyValue, propertyType, creditScore,
      employmentType, annualIncome,
      goalType, // "lower_payment" | "cash_out" | "shorter_term"
      cashOutAmount,
    } = body;

    // Validate required
    if (!email && !phone) return NextResponse.json({ error: "Email or phone required" }, { status: 400 });

    // Calculate refi scenarios
    const currentRate30 = 6.49;
    const currentRate15 = 5.82;
    const loanAmount = parseFloat(currentLoanBalance) || 0;

    const newPayment30 = calcPayment(loanAmount, currentRate30, 30);
    const newPayment15 = calcPayment(loanAmount, currentRate15, 15);
    const oldPayment = parseFloat(currentMonthlyPayment) || calcPayment(loanAmount, parseFloat(currentRate) || 7.5, 30);
    const monthlySavings30 = Math.round(oldPayment - newPayment30);
    const annualSavings30 = monthlySavings30 * 12;
    const breakEven = monthlySavings30 > 0 ? Math.round((loanAmount * 0.025) / monthlySavings30) : null;

    const loanId = `refi-${Date.now()}`;

    // 1. Save to Supabase leads table
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: `${firstName || ""} ${lastName || ""}`.trim() || email,
        email: email || null,
        phone: phone || null,
        goal: goalType === "lower_payment" ? "Refinance - Lower Payment" : goalType === "cash_out" ? "Refinance - Cash Out" : goalType === "shorter_term" ? "Refinance - Shorter Term" : "Refinance",
        property_type: propertyType || null,
        loan_amount: currentLoanBalance || null,
        credit_score: creditScore || null,
        employment: employmentType || null,
        source: "refi-calculator",
        status: "new",
        notes: [
          currentRate ? `Current rate: ${currentRate}%` : null,
          currentMonthlyPayment ? `Current payment: $${currentMonthlyPayment}/mo` : null,
          propertyValue ? `Property value: $${propertyValue}` : null,
          annualIncome ? `Income: $${annualIncome}` : null,
          cashOutAmount ? `Cash out requested: $${cashOutAmount}` : null,
          monthlySavings30 > 0 ? `Potential savings: $${monthlySavings30}/mo` : null,
        ].filter(Boolean).join(" | "),
      }),
    });

    // 2. Send email to Josh
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Rockwell Mortgage <noreply@rockwellmtg.com>",
        to: [NOTIFY],
        subject: `🏠 New Refi Quote: ${firstName || ""} ${lastName || ""} — $${monthlySavings30 > 0 ? monthlySavings30 + "/mo savings" : loanAmount.toLocaleString()}`,
        html: `
          <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#111113;padding:24px;border-radius:12px;border:1px solid #1E1E22;">
            <h2 style="color:#C9A84C;margin:0 0 16px;">⚔️ New Refi Ready Lead — Rockwell Mortgage</h2>
            
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:6px 0;color:#A1A1AA;font-size:13px;width:160px;">Name</td><td style="padding:6px 0;color:#F4F4F5;font-weight:600;">${firstName || ""} ${lastName || ""}</td></tr>
              <tr><td style="padding:6px 0;color:#A1A1AA;font-size:13px;">Email</td><td style="padding:6px 0;color:#7EB8F7;">${email || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#A1A1AA;font-size:13px;">Phone</td><td style="padding:6px 0;color:#F4F4F5;">${phone || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#A1A1AA;font-size:13px;">Goal</td><td style="padding:6px 0;color:#F4F4F5;">${goalType?.replace("_"," ") || "—"}</td></tr>
            </table>

            <div style="background:#18181B;border:1px solid #1E1E22;border-radius:8px;padding:16px;margin-bottom:16px;">
              <div style="color:#A1A1AA;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:12px;">Current Loan</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Balance</td><td style="padding:4px 0;color:#F4F4F5;">$${parseFloat(currentLoanBalance||"0").toLocaleString()}</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Current Rate</td><td style="padding:4px 0;color:#EB5757;">${currentRate || "?"}%</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Monthly Payment</td><td style="padding:4px 0;color:#F4F4F5;">$${parseFloat(currentMonthlyPayment||"0").toLocaleString()}/mo</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Property Value</td><td style="padding:4px 0;color:#F4F4F5;">$${parseFloat(propertyValue||"0").toLocaleString()}</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Credit Score</td><td style="padding:4px 0;color:#F4F4F5;">${creditScore || "?"}</td></tr>
              </table>
            </div>

            <div style="background:#0D2B0D;border:1px solid #1A4A1A;border-radius:8px;padding:16px;margin-bottom:16px;">
              <div style="color:#4CAF82;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:12px;">Refi Savings Analysis</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">New Rate (30yr)</td><td style="padding:4px 0;color:#4CAF82;">${currentRate30}%</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">New Payment (30yr)</td><td style="padding:4px 0;color:#4CAF82;">$${Math.round(newPayment30).toLocaleString()}/mo</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;font-weight:600;">Monthly Savings</td><td style="padding:4px 0;color:#4CAF82;font-weight:700;font-size:16px;">+$${monthlySavings30}/mo</td></tr>
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Annual Savings</td><td style="padding:4px 0;color:#4CAF82;">+$${annualSavings30.toLocaleString()}/yr</td></tr>
                ${breakEven ? `<tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">Break-Even</td><td style="padding:4px 0;color:#F4F4F5;">${breakEven} months</td></tr>` : ""}
                <tr><td style="padding:4px 0;color:#A1A1AA;font-size:13px;">15yr Option</td><td style="padding:4px 0;color:#7EB8F7;">$${Math.round(newPayment15).toLocaleString()}/mo @ ${currentRate15}%</td></tr>
              </table>
            </div>

            ${cashOutAmount ? `<p style="color:#A1A1AA;font-size:13px;">💰 Cash-out requested: <strong style="color:#F4F4F5;">$${parseFloat(cashOutAmount).toLocaleString()}</strong></p>` : ""}
            
            <a href="https://client-pulse-sigma.vercel.app/leads" style="display:inline-block;padding:12px 24px;background:#C9A84C;color:#0A0A0B;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin-top:8px;">View in Client Pulse →</a>
          </div>
        `,
      }),
    });

    return NextResponse.json({
      success: true,
      savings: {
        monthly30: monthlySavings30,
        annual30: annualSavings30,
        newPayment30: Math.round(newPayment30),
        newPayment15: Math.round(newPayment15),
        newRate30: currentRate30,
        newRate15: currentRate15,
        breakEven,
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
