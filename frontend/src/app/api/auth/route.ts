import { NextResponse } from "next/server";
import { type ContentData, readData } from "@/data/db";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const data = await readData<ContentData>(
      "content",
      "content.json",
      {} as ContentData,
    );

    if (!data.admin || password !== data.admin.passwordHash) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
