import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { analyzeScam } from "@/lib/featherless";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    const worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from image" },
        { status: 422 }
      );
    }
    const analysis = await analyzeScam(text.trim());
    return NextResponse.json({
      extracted_text: text.trim(),
      analysis,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
