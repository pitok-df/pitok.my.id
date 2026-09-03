import { NextResponse } from "next/server";
import { type Reply, readData, type Topic, writeData } from "@/data/db";

const DEFAULT_TOPICS: Topic[] = [];

export async function GET() {
  try {
    const data = await readData<Topic[]>(
      "topics",
      "topics.json",
      DEFAULT_TOPICS,
    );
    // Sort topics: newest first
    const sorted = data.sort(
      (a: Topic, b: Topic) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to read topics" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    const topics = await readData<Topic[]>(
      "topics",
      "topics.json",
      DEFAULT_TOPICS,
    );

    // ACTION: CREATE TOPIC
    if (action === "create") {
      const { title, description, creator } = body;
      if (
        !title ||
        !title.trim() ||
        !description ||
        !description.trim() ||
        !creator ||
        !creator.trim()
      ) {
        return NextResponse.json(
          { error: "Title, description, and creator name are required" },
          { status: 400 },
        );
      }

      const newTopic: Topic = {
        id: Date.now(),
        title: title.trim().slice(0, 80),
        description: description.trim().slice(0, 300),
        creator: creator.trim().slice(0, 30),
        timestamp: new Date().toISOString(),
        replies: [],
      };

      topics.push(newTopic);

      // Keep maximum 50 topics
      const limited = topics.slice(-50);
      await writeData<Topic[]>("topics", "topics.json", limited);
      return NextResponse.json(newTopic);
    }

    // ACTION: REPLY TO TOPIC
    else if (action === "reply") {
      const { topicId, name, message, replyTo } = body;
      if (!topicId || !name || !name.trim() || !message || !message.trim()) {
        return NextResponse.json(
          { error: "Topic ID, name, and message are required" },
          { status: 400 },
        );
      }

      const topicIndex = topics.findIndex(
        (t: Topic) => t.id === Number(topicId),
      );
      if (topicIndex === -1) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }

      const newReply: Reply = {
        id: Date.now(),
        name: name.trim().slice(0, 30),
        replyTo: replyTo ? replyTo.trim().slice(0, 30) : null,
        message: message.trim().slice(0, 200),
        timestamp: new Date().toISOString(),
      };

      topics[topicIndex].replies.push(newReply);

      // Keep max 50 replies per topic
      if (topics[topicIndex].replies.length > 50) {
        topics[topicIndex].replies = topics[topicIndex].replies.slice(-50);
      }

      await writeData<Topic[]>("topics", "topics.json", topics);
      return NextResponse.json(newReply);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (_error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
