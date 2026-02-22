import { NextRequest, NextResponse } from "next/server";
import { screenEligibility } from "@/lib/screening-api";
import { ScreeningData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: ScreeningData = await request.json();

    const programs = await screenEligibility(body);

    return NextResponse.json({ eligiblePrograms: programs });
  } catch (error) {
    console.error("Screening API error:", error);
    return NextResponse.json(
      {
        error: "Failed to screen eligibility",
        eligiblePrograms: [],
      },
      { status: 502 }
    );
  }
}
