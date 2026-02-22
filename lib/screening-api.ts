import { ScreeningData, ProgramResult } from "./types";

const API_URL = process.env.SCREENING_API_URL;
const API_USERNAME = process.env.SCREENING_API_USERNAME;
const API_PASSWORD = process.env.SCREENING_API_PASSWORD;

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch(`${API_URL}/authToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: API_USERNAME,
      password: API_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.token;
  // Cache for 55 minutes (tokens typically expire in 60)
  tokenExpiresAt = Date.now() + 55 * 60 * 1000;

  return cachedToken!;
}

function buildHouseholdPayload(data: ScreeningData) {
  const persons = [];

  // Head of household
  persons.push({
    age: String(data.age ?? 30),
    householdMemberType: "HeadOfHousehold",
  });

  // Additional household members
  const size = data.householdSize ?? 1;
  for (let i = 2; i <= size; i++) {
    persons.push({
      age: "30",
      householdMemberType: "Unrelated",
    });
  }

  // The API expects a top-level array with household[] and person[]
  return [
    {
      household: [
        {
          cashOnHand: String(data.annualIncome ?? 0),
        },
      ],
      person: persons,
    },
  ];
}

export async function screenEligibility(
  data: ScreeningData
): Promise<ProgramResult[]> {
  const token = await getAuthToken();
  const payload = buildHouseholdPayload(data);

  const res = await fetch(`${API_URL}/eligibilityPrograms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      `Screening API error: ${res.status} ${res.statusText}`
    );
  }

  const responseData = await res.json();

  const programs: ProgramResult[] = [];

  if (Array.isArray(responseData.eligiblePrograms)) {
    for (const prog of responseData.eligiblePrograms) {
      programs.push({
        programName: prog.name ?? "Unknown Program",
        programCode: prog.code ?? "",
        eligible: true,
      });
    }
  }

  return programs;
}
