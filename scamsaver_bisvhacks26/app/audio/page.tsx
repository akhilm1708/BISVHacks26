import AudioUploader from '@/components/AudioUploader'

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight mb-3">Analyze a Call Recording</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-10 sm:mb-12 max-w-xl leading-relaxed">
          Upload a voicemail or recording of a suspicious call. Supports MP3, WAV, M4A.
        </p>
        <AudioUploader />
      </div>
    </div>
  )
}
