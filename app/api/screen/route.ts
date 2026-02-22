import { NextRequest, NextResponse } from "next/server";
import { screenEligibility } from "@/lib/screening-api";
import { ScreeningData } from "@/lib/types";

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

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const body: ScreeningData = await request.json();

    const programs = await screenEligibility(body);

    return NextResponse.json(
      { eligiblePrograms: programs },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Screening API error:", error);
    return NextResponse.json(
      {
        error: "Failed to screen eligibility",
        eligiblePrograms: [],
      },
      { status: 502, headers: corsHeaders(origin) }
    );
  }
}
