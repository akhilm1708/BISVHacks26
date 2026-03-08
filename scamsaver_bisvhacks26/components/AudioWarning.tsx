export default function AudioWarning({ analysis }: { analysis: object }) {
  return (
    <button
      type="button"
      className="bg-white border border-slate-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl px-6 py-3.5 font-semibold text-base transition-all shadow-sm hover:shadow"
    >
      Play audio summary
    </button>
  )
}
