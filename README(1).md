# 🛡️ ScamSaver

> **AI-powered scam detection for messages, calls, and screenshots — in real time.**

Built at **BISVHacks 2026** by Akhil & Isaac.

🔗 **Live Demo:** [scam-saver.vercel.app](https://scam-saver.vercel.app)

---

## 🚨 The Problem

Americans lost over **$10 billion to scams in 2023 alone.** Suspicious texts, locked account alerts, IRS calls — most people have no way to know in the moment whether something is real or not. We got one of these calls the morning of the hackathon. That's why we built ScamSaver.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Message Analyzer** | Paste any suspicious text or email and get an instant scam probability score |
| 🖼️ **Screenshot Scanner** | Upload an image — Tesseract.js extracts the text, AI analyzes it |
| 🎙️ **Audio Analyzer** | Upload a voicemail or call recording for transcription and scam detection |
| 📞 **Live Call Protection** | Press one button during a suspicious call — AI listens and warns you in real time |
| 📚 **Learn About Scams** | AI-generated flashcards to help you recognize common scam patterns |

Every analysis returns:
- A **scam probability score** (0–100%)
- A **risk level** (Safe / Suspicious / Likely Scam)
- **Suspicious phrases** highlighted
- A plain-language **explanation** and **recommended action**

---

## 🛠️ How It's Built

### Frontend
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** for styling
- **Tesseract.js** for screenshot OCR
- **Web Speech API** for live call transcription
- **Recharts** for real-time scam visualization

### Backend
- **Next.js API Routes**
- **Featherless.ai** (Llama 3.1 8B) for scam detection and analysis
- **Deepgram** for audio transcription
- **ElevenLabs** for voice warnings

### Infrastructure
- **Vercel** for deployment
- **GitHub** (branched workflow) for parallel development

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-username/BISVHacks26.git
cd BISVHacks26/scamsaver_bisvhacks26
npm install
```

### Environment Variables

Create a `.env.local` file in `scamsaver_bisvhacks26/`:

```env
FEATHERLESS_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
DEEPGRAM_API_KEY=
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
scamsaver_bisvhacks26/
├── app/
│   ├── analyze/        # Message analyzer page
│   ├── screenshot/     # Screenshot scanner page
│   ├── audio/          # Audio upload page
│   ├── live/           # Live call protection page
│   ├── learn/          # Flashcards & tips page
│   └── api/
│       ├── analyze/        # Featherless scam detection
│       ├── screenshot/     # Tesseract OCR + analysis
│       ├── audio/          # Deepgram transcription + analysis
│       ├── live-transcribe/ # Real-time Deepgram transcription
│       ├── voice-warning/  # ElevenLabs TTS
│       └── flashcards/     # AI-generated flashcards
├── components/
│   ├── RiskMeter.tsx
│   ├── MessageAnalyzer.tsx
│   ├── ScreenshotUploader.tsx
│   ├── AudioUploader.tsx
│   ├── LiveCallListener.tsx
│   ├── AudioWarning.tsx
│   └── FlashcardViewer.tsx
└── lib/
    ├── featherless.ts
    └── elevenlabs.ts
```

---

## ⚡ Challenges

- **ElevenLabs went down mid-hackathon** and took out audio transcription. We swapped in Deepgram within 30 minutes without losing any features.
- Getting live call transcription to feel genuinely real-time was harder than expected — chunks too short wouldn't transcribe. After ~2 hours of debugging, we switched to **Web Speech API** for live transcription, which nailed the real-time feel.
- Parallel development hit a rough patch when a bad commit broke the workflow — we recovered and finished the project on one laptop together.

---

## 🏆 What We're Proud Of

The **Live Call Protection** feature. Press one button during a suspicious call and AI warns you in real time. That's what we came to the hackathon to build — and we shipped it.

---

## 🔮 What's Next

- 📱 Phone number lookup before you even pick up
- 🌐 Browser extension for suspicious emails
- 🌍 Multilingual support for non-English speakers
- 📊 Dashboard to track and log scam attempts over time

---

## 👥 Team

| Name | Role |
|---|---|
| **Akhil** | Frontend & UI |
| **Isaac** | Backend & AI Integration |

---

## 📄 License

MIT License — feel free to build on this.

---

*Built with ❤️ at BISVHacks 2026*
