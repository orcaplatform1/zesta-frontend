import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  const expected = process.env.EBOOK_ACCESS_CODE ?? "";
  if (!expected) {
    return NextResponse.json({ error: "Sunucu yapılandırması eksik." }, { status: 500 });
  }
  const valid = code.toLowerCase().trim() === expected.toLowerCase().trim();
  if (!valid) {
    return NextResponse.json({ error: "Kod geçersiz. Lütfen tekrar deneyin." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
