export type LoanStatus = "lead" | "pre-approval" | "application" | "processing" | "underwriting" | "clear-to-close" | "closed" | "lost";
export type LoanType = "Conventional" | "FHA" | "VA" | "Jumbo" | "USDA" | "Non-QM" | "Reverse";
export type LeadSource = "Referral" | "Realtor Partner" | "Website" | "Social Media" | "Past Client" | "Cold Outreach" | "Open House" | "Zillow" | "Veterans Affairs";

export interface MortgageContact {
  id: string;
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  workPhone?: string;
  dateOfBirth?: string;
  ssn?: string; // last 4 only
  // Address
  currentAddress: string;
  city: string;
  state: string;
  zip: string;
  // Employment
  employer?: string;
  jobTitle?: string;
  yearsEmployed?: number;
  annualIncome?: number;
  employmentType?: "W-2" | "Self-Employed" | "1099" | "Retired" | "Military";
  // Loan info
  loanStatus: LoanStatus;
  loanType?: LoanType;
  loanAmount?: number;
  purchasePrice?: number;
  downPayment?: number;
  interestRate?: number;
  currentRate?: number; // if refi
  propertyType?: "Single Family" | "Condo" | "Townhouse" | "Multi-Family" | "Investment";
  propertyAddress?: string;
  // Credit
  creditScore?: number;
  dti?: number; // debt-to-income %
  // Dates
  applicationDate?: string;
  targetCloseDate?: string;
  closedDate?: string;
  lastContactDate: string;
  // CRM
  leadSource: LeadSource;
  assignedLO?: string;
  realtorPartner?: string;
  coBorowwer?: string;
  tags: string[];
  notes?: string;
  priority?: "hot" | "warm" | "cold";
  // Financials
  totalAssets?: number;
  monthlyDebts?: number;
}

export const CURRENT_RATE = 6.49;

export function calcMonthly(amount: number, rate: number, years = 30) {
  const r = rate / 100 / 12, n = years * 12;
  if (r === 0) return amount / n;
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcRefiSavings(amount: number, oldRate: number) {
  const old = calcMonthly(amount, oldRate);
  const next = calcMonthly(amount, CURRENT_RATE);
  return Math.round(old - next);
}

export const STATUS_META: Record<LoanStatus, { label: string; color: string; bg: string }> = {
  "lead":         { label: "Lead",            color: "#6b7280", bg: "#f3f4f6" },
  "pre-approval": { label: "Pre-Approval",    color: "#7c3aed", bg: "#f5f3ff" },
  "application":  { label: "Application",     color: "#3b82f6", bg: "#eff6ff" },
  "processing":   { label: "Processing",      color: "#f59e0b", bg: "#fffbeb" },
  "underwriting": { label: "Underwriting",    color: "#f97316", bg: "#fff7ed" },
  "clear-to-close":{ label: "Clear to Close", color: "#10b981", bg: "#ecfdf5" },
  "closed":       { label: "Closed ✓",        color: "#10b981", bg: "#ecfdf5" },
  "lost":         { label: "Lost",            color: "#ef4444", bg: "#fef2f2" },
};

export const contacts: MortgageContact[] = [
  {
    id: "1", firstName: "Mike", lastName: "Johnson", email: "mike.johnson@gmail.com",
    phone: "(801) 555-0101", mobilePhone: "(801) 555-0102",
    dateOfBirth: "1985-04-12", currentAddress: "1234 Maple St", city: "South Jordan", state: "UT", zip: "84095",
    employer: "Adobe Systems", jobTitle: "Software Engineer", yearsEmployed: 6, annualIncome: 145000, employmentType: "W-2",
    loanStatus: "pre-approval", loanType: "Conventional", loanAmount: 520000, purchasePrice: 650000, downPayment: 130000,
    propertyType: "Single Family", creditScore: 762, dti: 28,
    applicationDate: "2026-03-20", targetCloseDate: "2026-04-30", lastContactDate: "2026-03-27",
    leadSource: "Referral", assignedLO: "Josh Graves", realtorPartner: "Dave Carter",
    tags: ["first-time", "purchase", "hot"], priority: "hot", notes: "Pre-approval issued. Shopping in Draper/South Jordan.",
    totalAssets: 280000, monthlyDebts: 850,
  },
  {
    id: "2", firstName: "Sarah", lastName: "Thompson", email: "sarah.t@email.com",
    phone: "(801) 555-0234", currentAddress: "567 Oak Ave", city: "Sandy", state: "UT", zip: "84070",
    employer: "Mountain West Hospital", jobTitle: "RN", yearsEmployed: 8, annualIncome: 92000, employmentType: "W-2",
    loanStatus: "processing", loanType: "FHA", loanAmount: 340000, purchasePrice: 355000, downPayment: 15000,
    propertyType: "Townhouse", creditScore: 688, dti: 35,
    applicationDate: "2026-03-10", targetCloseDate: "2026-04-18", lastContactDate: "2026-03-28",
    leadSource: "Realtor Partner", assignedLO: "Josh Graves", realtorPartner: "Lisa Park",
    tags: ["fha", "first-time"], priority: "hot", notes: "Docs received, sent to processing. Good file.",
    totalAssets: 42000, monthlyDebts: 450,
  },
  {
    id: "3", firstName: "Carlos", lastName: "Rivera", email: "c.rivera@email.com",
    phone: "(385) 555-0317", currentAddress: "8901 Pine Rd", city: "Holladay", state: "UT", zip: "84117",
    employer: "Zions Bank", jobTitle: "VP Operations", yearsEmployed: 14, annualIncome: 210000, employmentType: "W-2",
    loanStatus: "underwriting", loanType: "Jumbo", loanAmount: 850000, purchasePrice: 1050000, downPayment: 200000,
    propertyType: "Single Family", creditScore: 788, dti: 24,
    applicationDate: "2026-03-05", targetCloseDate: "2026-04-10", lastContactDate: "2026-03-25",
    leadSource: "Referral", assignedLO: "Josh Graves",
    tags: ["jumbo", "high-value"], priority: "hot",
    totalAssets: 1200000, monthlyDebts: 1200,
  },
  {
    id: "4", firstName: "Jennifer", lastName: "Walsh", email: "jwalsh@email.com",
    phone: "(801) 555-0445", currentAddress: "234 Elm St", city: "Murray", state: "UT", zip: "84107",
    currentRate: 7.25, loanStatus: "lead", loanType: "Conventional", loanAmount: 380000,
    propertyType: "Single Family",
    lastContactDate: "2026-01-15", leadSource: "Past Client", assignedLO: "Josh Graves",
    tags: ["past-client", "refi-candidate"], priority: "warm",
    notes: "Closed at 7.25% in Jan 2026. Should reach out about refi savings.",
  },
  {
    id: "5", firstName: "Tyler", lastName: "Moss", email: "tmoss@email.com",
    phone: "(385) 555-0621", currentAddress: "456 Cedar Lane", city: "West Valley", state: "UT", zip: "84119",
    employer: "US Army", jobTitle: "Active Duty", employmentType: "Military",
    loanStatus: "pre-approval", loanType: "VA", loanAmount: 420000, purchasePrice: 420000, downPayment: 0,
    propertyType: "Single Family", creditScore: 724, dti: 31,
    applicationDate: "2026-03-26", targetCloseDate: "2026-05-01", lastContactDate: "2026-03-28",
    leadSource: "Veterans Affairs", assignedLO: "Jeremy Moyes",
    tags: ["va", "military", "no-down"], priority: "warm",
    notes: "Certificate of Eligibility received. Zero down VA loan.",
    totalAssets: 28000, monthlyDebts: 600,
  },
  {
    id: "6", firstName: "Rachel", lastName: "Chen", email: "rchen@email.com",
    phone: "(801) 555-0789", currentAddress: "789 Birch Blvd", city: "Midvale", state: "UT", zip: "84047",
    employer: "Self-Employed", jobTitle: "Business Owner", yearsEmployed: 5, annualIncome: 180000, employmentType: "Self-Employed",
    loanStatus: "application", loanType: "Non-QM", loanAmount: 480000, purchasePrice: 595000,
    propertyType: "Single Family", creditScore: 741, dti: 38,
    applicationDate: "2026-03-22", targetCloseDate: "2026-05-15", lastContactDate: "2026-03-27",
    leadSource: "Social Media", assignedLO: "Josh Graves",
    tags: ["self-employed", "bank-statement"], priority: "warm",
    notes: "Using bank statement loan. 24 months statements collected.",
    totalAssets: 320000, monthlyDebts: 1800,
  },
];

export const PIPELINE_STAGES: LoanStatus[] = [
  "lead", "pre-approval", "application", "processing", "underwriting", "clear-to-close", "closed", "lost"
];
