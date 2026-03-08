import AudioUploader from '@/components/AudioUploader'

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Analyze a Call Recording</h1>
        <p className="text-gray-600 mb-2">
          Upload a voicemail or recording of a suspicious call to get a scam analysis.
        </p>
        <p className="text-gray-500 text-sm mb-6">Supports MP3, WAV, M4A formats.</p>
        <AudioUploader />
      </div>
    </div>
  )
}
