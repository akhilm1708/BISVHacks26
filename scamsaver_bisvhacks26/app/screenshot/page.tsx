import ScreenshotUploader from '@/components/ScreenshotUploader'

export default function ScreenshotPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Scan a Screenshot</h1>
        <p className="text-gray-600 mb-6">
          Upload a photo of a suspicious text, email, or website.
        </p>
        <ScreenshotUploader />
      </div>
    </div>
  )
}
