import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split("\n");
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must have headers and data" }, { status: 400 });
    }

    const headers = lines[0].split(",").map((h: string) => h.trim().toLowerCase());
    const contacts = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v: string) => v.trim());
      const row: any = {};
      
      headers.forEach((header: string, idx: number) => {
        row[header] = values[idx] || "";
      });

      const firstName = row["primary borrower first name"] || row["first name"] || "";
      const lastName = row["primary borrower last name"] || row["last name"] || "";
      const email = row["primary borrower email"] || row["email"] || "";
      const phone = row["primary borrower home phone"] || row["primary borrower cell phone"] || row["phone"] || "";
      const city = row["subject city"] || row["city"] || "";
      const state = row["subject state"] || row["state"] || "";
      const zip = row["subject zip"] || row["zip"] || "";

      if (!firstName || !email) continue;

      contacts.push({
        id: Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        phone,
        currentAddress: row["subject address line 1"] || row["address"] || "",
        city,
        state,
        zip,
        employer: row["primary borrower employer"] || row["employer"] || "",
        loanStatus: "lead",
        loanType: row["mortgage type"] || "Conventional",
        loanAmount: parseFloat(row["total loan amount"]) || undefined,
        purchasePrice: parseFloat(row["purchase price"]) || undefined,
        interestRate: parseFloat(row["interest rate"]) || undefined,
        creditScore: parseInt(row["loan fico"] || row["primary borrower fico"]) || undefined,
        leadSource: row["lead source"] || "Cold Outreach",
        tags: [row["source"] || "import"],
        lastContactDate: new Date().toISOString(),
      });
    }

    return NextResponse.json({ 
      success: true,
      count: contacts.length,
      contacts,
      message: `Successfully imported ${contacts.length} contacts`
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Import failed: ${error.message}` }, { status: 500 });
  }
}
