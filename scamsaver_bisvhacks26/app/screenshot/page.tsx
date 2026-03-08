import ScreenshotUploader from '@/components/ScreenshotUploader'

export default function ScreenshotPage() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight mb-3">Scan a Screenshot</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-10 sm:mb-12 max-w-xl leading-relaxed">
          Upload a photo of a suspicious text, email, or website.
        </p>
        <ScreenshotUploader />
      </div>
    </div>
  )
}
