import FlashcardViewer from '@/components/FlashcardViewer'

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Learn About Scams</h1>
        <p className="text-gray-600 mb-6">
          Study these flashcards to spot common scams targeting elderly users.
        </p>
        <FlashcardViewer />
      </div>
    </div>
  )
}
