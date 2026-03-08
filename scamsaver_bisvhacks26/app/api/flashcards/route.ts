import { NextResponse } from "next/server";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

let cachedCards: Flashcard[] | null = null;

export async function GET() {
  try {
    if (cachedCards !== null) {
      return NextResponse.json(cachedCards);
    }

    const res = await fetch("https://api.featherless.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.FEATHERLESS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a scam education assistant. Return ONLY a valid JSON array, no markdown, no code fences, no other text.",
          },
          {
            role: "user",
            content:
              'Generate 8 educational flashcards about common scams targeting elderly people including phishing, phone scams, prize scams, romance scams, and tech support scams. Use this exact structure: [{"id":1,"front":"Question here","back":"Simple clear answer here","category":"Phishing"}]',
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    let content: string = data.choices?.[0]?.message?.content ?? "";
    content = content.replace(/```json|```/g, "").trim();
    const cards: Flashcard[] = JSON.parse(content);
    cachedCards = cards;
    return NextResponse.json(cards);
  } catch {
    return NextResponse.json(
      { error: "Could not load flashcards" },
      { status: 500 }
    );
  }
}
