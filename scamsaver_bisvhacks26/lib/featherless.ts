export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
}

export interface ScamAnalysis {
  scam_probability: number;
  risk_level: "Safe" | "Suspicious" | "Likely Scam";
  scam_type: string;
  confidence: number;
  suspicious_phrases: SuspiciousPhrase[];
  reason: string;
  recommended_action: string;
}

export async function analyzeScam(text: string): Promise<ScamAnalysis> {
  try {
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
              'You are a cybersecurity assistant specializing in detecting online scams targeting elderly users. Analyze the message and return ONLY valid JSON — no markdown, no code fences, no other text — using this exact structure: {"scam_probability":0-100,"risk_level":"Safe | Suspicious | Likely Scam","scam_type":"Phishing | Impersonation | Financial Scam | Tech Support Scam | Prize Scam | Unknown","confidence":0.0-1.0,"suspicious_phrases":[{"phrase":"exact quote from message","reason":"one short sentence why this phrase is suspicious"}],"reason":"Simple explanation suitable for elderly users.","recommended_action":"Clear next step for the user."}',
          },
          {
            role: "user",
            content: "Analyze this message: " + text,
          },
        ],
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(
        `Featherless API error: ${res.status} ${res.statusText}${errBody ? " - " + errBody : ""}`
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw =
      data.choices?.[0]?.message?.content?.trim() ??
      (() => {
        throw new Error("Featherless API error: No content in response");
      })();

    let jsonStr = raw;
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    if (Array.isArray(parsed.suspicious_phrases)) {
      parsed.suspicious_phrases = parsed.suspicious_phrases.map((item: unknown) =>
        typeof item === "object" && item !== null && "phrase" in item
          ? item
          : { phrase: String(item), reason: "Flagged as suspicious." }
      );
    }
    return parsed as unknown as ScamAnalysis;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.startsWith("Featherless API error:")) throw err;
      throw new Error("Featherless API error: " + err.message);
    }
    throw new Error("Featherless API error: Unknown error");
  }
}
