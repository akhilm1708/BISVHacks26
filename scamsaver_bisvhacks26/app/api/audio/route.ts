import { NextResponse } from "next/server";
import { analyzeScam } from "@/lib/featherless";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;
    if (!audio) {
      return NextResponse.json(
        { error: "No audio provided" },
        { status: 400 }
      );
    }

    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramKey) {
      return NextResponse.json(
        { error: "Missing DEEPGRAM_API_KEY" },
        { status: 500 }
      );
    }

    const url = new URL("https://api.deepgram.com/v1/listen");
    url.searchParams.set("model", "nova-2");
    url.searchParams.set("smart_format", "true");
    url.searchParams.set("punctuate", "true");

    const audioBytes = Buffer.from(await audio.arrayBuffer());
    const transcribeRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramKey}`,
        "Content-Type": audio.type || "application/octet-stream",
      },
      body: audioBytes,
    });

    if (!transcribeRes.ok) {
      const err = await transcribeRes.text();
      // Live call sends small chunks; Deepgram often returns 400 for corrupt/unsupported.
      // Return success with empty content so the client keeps the interval running and transcript growing.
      if (transcribeRes.status === 400) {
        return NextResponse.json({ transcript: "", analysis: null });
      }
      return NextResponse.json(
        { error: "Transcription failed: " + err },
        { status: 500 }
      );
    }

    const transcribeData = (await transcribeRes.json()) as {
      results?: {
        channels?: Array<{
          alternatives?: Array<{ transcript?: string }>;
        }>;
      };
    };
    const transcript: string =
      transcribeData.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

    if (!transcript || transcript.trim() === "") {
      // Empty transcript (silence/short chunk) — return success so live call keeps going.
      return NextResponse.json({ transcript: "", analysis: null });
    }
    const analysis = await analyzeScam(transcript.trim());
    return NextResponse.json({
      transcript: transcript.trim(),
      analysis,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
