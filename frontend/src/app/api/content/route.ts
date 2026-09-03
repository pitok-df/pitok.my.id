import { NextResponse } from "next/server";
import { type ContentData, readData, writeData } from "@/data/db";

export async function GET() {
  try {
    const data = await readData<ContentData>(
      "content",
      "content.json",
      {} as ContentData,
    );
    // Don't expose admin password
    const { admin: _admin, ...safe } = data;
    return NextResponse.json(safe);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, ...updates } = body;

    // Read existing content
    const existing = await readData<ContentData>(
      "content",
      "content.json",
      {} as ContentData,
    );

    // Verify password
    if (!existing.admin || password !== existing.admin.passwordHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Merge updates (preserve admin config)
    const updated = {
      ...existing,
      ...updates,
      admin: existing.admin, // always keep admin config
    };

    await writeData<ContentData>(
      "content",
      "content.json",
      updated as ContentData,
    );

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
