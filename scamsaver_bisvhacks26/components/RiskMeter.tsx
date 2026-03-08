type RiskMeterProps = {
  probability: number
}

function getVariant(probability: number): 'safe' | 'suspicious' | 'scam' {
  if (probability <= 39) return 'safe'
  if (probability <= 74) return 'suspicious'
  return 'scam'
}

export default function RiskMeter({ probability }: RiskMeterProps) {
  const variant = getVariant(probability)

  const percentColor =
    variant === 'safe'
      ? 'text-black'
      : variant === 'suspicious'
        ? 'text-amber-500'
        : 'text-red-500'

  const badgeStyles =
    variant === 'safe'
      ? 'bg-green-50 text-green-600 border border-green-200'
      : variant === 'suspicious'
        ? 'bg-amber-50 text-amber-600 border border-amber-200'
        : 'bg-red-50 text-red-600 border border-red-200'

  const badgeLabel =
    variant === 'safe'
      ? '✅ SAFE'
      : variant === 'suspicious'
        ? '⚠️ SUSPICIOUS'
        : '🚨 LIKELY SCAM'

  const barColor =
    variant === 'safe'
      ? 'bg-blue-600'
      : variant === 'suspicious'
        ? 'bg-amber-400'
        : 'bg-red-500'

  const helperText =
    variant === 'safe'
      ? 'This looks safe — no action needed'
      : variant === 'suspicious'
        ? 'Proceed with caution'
        : 'High risk — do not respond to this message'

  return (
    <div className="flex flex-col items-center py-4 sm:py-6">
      <span className={`font-black text-5xl sm:text-6xl md:text-7xl tabular-nums ${percentColor}`}>
        {probability}%
      </span>

      <span
        className={`mt-3 rounded-full text-sm font-semibold px-4 py-1.5 border ${badgeStyles}`}
      >
        {badgeLabel}
      </span>

      <div className="w-full max-w-xs sm:max-w-sm h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden mt-5">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${probability}%` }}
        />
      </div>

      <p className="text-gray-500 text-sm sm:text-base text-center mt-3 max-w-[20rem] leading-relaxed">
        {helperText}
      </p>
    </div>
  )
}
