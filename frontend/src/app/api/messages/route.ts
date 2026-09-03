import { NextResponse } from "next/server";
import { type ContentData, type Message, readData, writeData } from "@/data/db";

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 1,
    name: "Sistem",
    message:
      "Selamat datang di Live Guestbook pitok.my.id! Silakan tinggalkan pesan Anda di sini untuk berinteraksi.",
    timestamp: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const data = await readData<Message[]>(
      "messages",
      "messages.json",
      DEFAULT_MESSAGES,
    );
    // Return sorted messages: newest first
    const sorted = data.sort(
      (a: Message, b: Message) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to read messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message } = body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    const messages = await readData<Message[]>(
      "messages",
      "messages.json",
      DEFAULT_MESSAGES,
    );

    const newMessage: Message = {
      id: Date.now(),
      name: name.trim().slice(0, 30), // Max 30 chars for name
      message: message.trim().slice(0, 250), // Max 250 chars for safety
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Keep only last 100 messages to avoid large files
    const limited = messages.slice(-100);

    await writeData<Message[]>("messages", "messages.json", limited);

    return NextResponse.json(newMessage);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to post message" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, password } = body;

    // Verify admin password
    const contentData = await readData<ContentData>(
      "content",
      "content.json",
      {} as ContentData,
    );

    if (!contentData.admin || password !== contentData.admin.passwordHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await readData<Message[]>(
      "messages",
      "messages.json",
      DEFAULT_MESSAGES,
    );

    const filtered = messages.filter((m: Message) => m.id !== id);

    await writeData<Message[]>("messages", "messages.json", filtered);

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
