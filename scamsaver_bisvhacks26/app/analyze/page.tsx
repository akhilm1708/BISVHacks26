import MessageAnalyzer from '@/components/MessageAnalyzer'

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">Analyze a Message</h1>
        <MessageAnalyzer />
      </div>
    </div>
  )
}
