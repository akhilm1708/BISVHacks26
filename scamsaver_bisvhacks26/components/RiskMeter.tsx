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
      ? 'text-green-600'
      : variant === 'suspicious'
        ? 'text-amber-500'
        : 'text-red-600'

  const badgeStyles =
    variant === 'safe'
      ? 'bg-green-100 text-green-800'
      : variant === 'suspicious'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-red-100 text-red-800'

  const badgeLabel =
    variant === 'safe'
      ? '✅ SAFE'
      : variant === 'suspicious'
        ? '⚠️ SUSPICIOUS'
        : '🚨 LIKELY SCAM'

  const barColor =
    variant === 'safe'
      ? 'bg-green-500'
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
    <div className="flex flex-col items-center">
      <span
        className={`font-extrabold ${percentColor}`}
        style={{ fontSize: '5rem', fontWeight: 800 }}
      >
        {probability}%
      </span>

      <span
        className={`mt-2 px-4 py-1 rounded-full ${badgeStyles}`}
        style={{ fontSize: '1.1rem', fontWeight: 700 }}
      >
        {badgeLabel}
      </span>

      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${probability}%` }}
        />
      </div>

      <p className="text-base text-center mt-2 text-gray-500">
        {helperText}
      </p>
    </div>
  )
}
