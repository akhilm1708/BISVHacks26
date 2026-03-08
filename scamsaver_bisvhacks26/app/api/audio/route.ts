import { NextResponse } from "next/server";

// Server-side transcription (e.g. Deepgram) has been removed.
// Live Call uses the browser's Web Speech API instead.
// For uploaded audio files we no longer have a transcription backend.
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

    return NextResponse.json(
      {
        error:
          "File transcription is not available. Use Live Call Protection for real-time transcription (browser speech recognition).",
      },
      { status: 501 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
