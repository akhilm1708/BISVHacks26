import { NextResponse } from "next/server";
import { generateVoiceWarning } from "@/lib/elevenlabs";
import { ScamAnalysis } from "@/lib/featherless";

export async function POST(request: Request) {
  try {
    const { analysis }: { analysis: ScamAnalysis } = await request.json();
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis required" },
        { status: 400 }
      );
    }
    const warningText = `Warning. This message has a ${analysis.scam_probability} percent chance of being a scam. ${analysis.reason} ${analysis.recommended_action}`;
    const audioBuffer = await generateVoiceWarning(warningText);
    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
