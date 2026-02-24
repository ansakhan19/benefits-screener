import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EligibilityResult } from "@/lib/types";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

const ALLOWED_ORIGINS = [
  "https://qualifted.com",
  "https://www.qualifted.com",
];

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

function buildEmailHtml(result: EligibilityResult): string {
  const programsHtml =
    result.programs && result.programs.length > 0
      ? `
        <div style="margin-top: 24px; padding: 16px; background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #581c87; font-size: 16px;">Other Programs You May Qualify For</h3>
          <ul style="margin: 0; padding-left: 20px; color: #6b21a8;">
            ${result.programs.map((p) => `<li style="margin-bottom: 6px;">${p.programName}${p.description ? ` &mdash; ${p.description}` : ""}</li>`).join("")}
          </ul>
        </div>`
      : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">

  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="margin: 0 0 8px 0; color: #166534; font-size: 22px;">You Likely Qualify for Fair Fares NYC!</h1>
    <p style="margin: 0; color: #15803d;">${result.reason}</p>
  </div>

  <h2 style="color: #111827; font-size: 18px; margin-bottom: 16px;">Your Enrollment Checklist</h2>

  <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 15px;">1. Gather These Documents</h3>
    <ul style="margin: 0; padding-left: 20px; color: #374151;">
      <li style="margin-bottom: 6px;"><strong>Proof of identity</strong> &mdash; Government-issued photo ID (e.g. driver&rsquo;s license, passport, IDNYC)</li>
      <li style="margin-bottom: 6px;"><strong>Proof of NYC residency</strong> &mdash; Utility bill, lease agreement, or bank statement showing your NYC address</li>
      <li style="margin-bottom: 6px;"><strong>Proof of income</strong> &mdash; Recent pay stubs, tax return, or benefits letter showing household income</li>
    </ul>
  </div>

  <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 15px;">2. Create Your ACCESS HRA Account</h3>
    <p style="margin: 0 0 8px 0; color: #374151;">Visit the ACCESS HRA portal to create your account. You&rsquo;ll need your name, date of birth, and a password.</p>
    <a href="https://www1.nyc.gov/account/register.htm?spName=accesshra&target=aHR0cHM6Ly9hMDY5LWFjY2Vzcy5ueWMuZ292L2FjY2Vzc2hyYS9sb2dpbg==&lang=en_US&fromKiosk=true" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Enroll Now on ACCESS HRA</a>
  </div>

  <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 15px;">3. Submit Your Application</h3>
    <p style="margin: 0; color: #374151;">Once logged in, select <strong>&ldquo;Fair Fares NYC&rdquo;</strong> and upload your documents directly through the portal.</p>
  </div>

  <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 15px;">4. Wait for Approval</h3>
    <p style="margin: 0; color: #374151;">Applications are typically reviewed within <strong>30 days</strong>. Once approved, your Fair Fares OMNY card will be mailed to you within <strong>3 weeks</strong>.</p>
  </div>

  ${programsHtml}

  <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
    <p style="margin: 0; color: #1e40af; font-size: 14px;"><strong>With Fair Fares:</strong> You&rsquo;ll receive a 50% discount on subway and bus fares using your OMNY card, with a weekly cap of just $17.</p>
  </div>

  <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
    <p style="margin: 0 0 4px 0; color: #374151; font-size: 14px;"><strong>Prefer to apply in person?</strong></p>
    <p style="margin: 0; color: #374151; font-size: 14px;">Visit a Fair Fares NYC enrollment office with your documents. Find locations at <a href="https://www.nyc.gov/site/fairfares/index.page" style="color: #2563eb;">nyc.gov/fairfares</a>.</p>
  </div>

  <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">This email was sent by Fair Fares NYC Screener. You received this because you requested an enrollment checklist.</p>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const { email, result } = (await request.json()) as {
      email: string;
      result: EligibilityResult;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const { error } = await getResend().emails.send({
      from: "Fair Fares Screener <support@contactqualift.com>",
      to: email,
      subject: "Your Fair Fares NYC Enrollment Checklist",
      html: buildEmailHtml(result),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(origin) }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Send checklist error:", message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
