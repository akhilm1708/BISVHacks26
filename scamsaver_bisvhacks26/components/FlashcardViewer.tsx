export default function FlashcardViewer() {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm min-h-[14rem] sm:min-h-[16rem] p-8 sm:p-10 cursor-pointer hover:shadow-md transition-all relative">
        <span className="absolute top-5 right-5 bg-slate-100 text-slate-600 rounded-full px-3.5 py-1 text-sm font-medium">
          Category
        </span>
        <p className="text-black font-bold text-xl sm:text-2xl text-center mt-8 leading-snug">Front of card</p>
        <p className="text-gray-400 text-sm text-center mt-4">Click to flip</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="border border-slate-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 rounded-xl px-5 py-2.5 text-sm sm:text-base font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-500 text-sm sm:text-base font-medium">1 / 1</span>
        <button
          type="button"
          className="border border-slate-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 rounded-xl px-5 py-2.5 text-sm sm:text-base font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
