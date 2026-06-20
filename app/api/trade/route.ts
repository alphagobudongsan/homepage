import { NextRequest, NextResponse } from "next/server";
import { fetchAptTrade, getYearMonth } from "@/lib/molit";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lawdCd = searchParams.get("lawdCd") ?? "41630";
  const dealYmd = searchParams.get("dealYmd") ?? getYearMonth(1);

  try {
    const data = await fetchAptTrade(lawdCd, dealYmd);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch trade data" }, { status: 500 });
  }
}
