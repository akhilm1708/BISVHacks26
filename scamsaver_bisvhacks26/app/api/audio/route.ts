import { NextResponse } from "next/server";
import { analyzeScam } from "@/lib/featherless";

// Audio file uploads (Analyze a Recording) use Deepgram for transcription.
// Live Call uses the browser's Web Speech API and does not call this route for transcription.
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
        { error: "Missing DEEPGRAM_API_KEY. Add it to .env.local for file transcription." },
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
      if (transcribeRes.status === 400) {
        return NextResponse.json(
          { error: "Could not transcribe this audio. The file may be corrupt or in an unsupported format." },
          { status: 400 }
        );
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
      return NextResponse.json(
        { error: "Could not transcribe audio (no speech detected)." },
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
