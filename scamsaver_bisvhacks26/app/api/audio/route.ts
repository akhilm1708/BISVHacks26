import { NextResponse } from "next/server";
import { analyzeScam } from "@/lib/featherless";
import { DeepgramClient } from "@deepgram/sdk";

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

    const deepgram = new DeepgramClient({
      apiKey: process.env.DEEPGRAM_API_KEY!,
    });
    const buffer = Buffer.from(await audio.arrayBuffer());

    const response = await deepgram.listen.v1.media.transcribeFile(buffer, {
      model: "nova-2",
      smart_format: true,
    });

    const transcript =
      response.results?.channels?.[0]?.alternatives?.[0]?.transcript;

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
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
