import { NextResponse } from "next/server";
import { analyzeScam } from "@/lib/featherless";

export const maxDuration = 60;

function inferAudioContentType(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3)
    return "audio/webm";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46)
    return "audio/wav";
  if (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xfa))
    return "audio/mpeg";
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33)
    return "audio/mpeg";
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53)
    return "audio/ogg";
  return null;
}

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
    const contentType =
      audio.type?.trim() ||
      inferAudioContentType(audioBytes) ||
      "audio/webm";
    const transcribeRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramKey}`,
        "Content-Type": contentType,
      },
      body: audioBytes,
    });

    if (!transcribeRes.ok) {
      const err = await transcribeRes.text();
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
      return NextResponse.json(
        { error: "Could not transcribe audio" },
        { status: 422 }
      );
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
