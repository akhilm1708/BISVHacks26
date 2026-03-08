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

    const transcribeForm = new FormData();
    transcribeForm.append("file", audio);
    transcribeForm.append("model_id", "scribe_v1");

    const transcribeRes = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
        body: transcribeForm,
      }
    );

    if (!transcribeRes.ok) {
      const err = await transcribeRes.text();
      return NextResponse.json(
        { error: "Transcription failed: " + err },
        { status: 500 }
      );
    }

    const transcribeData = (await transcribeRes.json()) as { text?: string };
    const transcript: string = transcribeData.text ?? "";

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
