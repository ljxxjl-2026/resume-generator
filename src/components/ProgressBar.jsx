export default function ProgressBar({ steps, currentStep }) {
  return (
    <nav className="w-full px-6 py-4">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((label, i) => {
          const isCompleted = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={`h-0.5 flex-1 ${isCompleted ? 'bg-[var(--accent)]' : 'bg-gray-200'}`} />
                )}
                <div
                  aria-label={isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                    transition-all duration-300
                    ${isCompleted ? 'bg-[var(--accent)] text-white' : ''}
                    ${isCurrent  ? 'bg-[var(--accent-soft)] border-2 border-[var(--accent)] text-[var(--accent)]' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${isCompleted ? 'bg-[var(--accent)]' : 'bg-gray-200'}`} />
                )}
              </div>
              <span className={`text-[10px] mt-1 text-center leading-tight
                ${isCurrent ? 'text-[var(--accent)] font-medium' : 'text-gray-400'}
              `}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
