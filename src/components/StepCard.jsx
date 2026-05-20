import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const STEPS_META = [
  { label: '基本信息', path: '/step/basic' },
  { label: '教育背景', path: '/step/education' },
  { label: '实习经历', path: '/step/experience' },
  { label: '获奖情况', path: '/step/awards' },
  { label: '技能特长', path: '/step/skills' },
  { label: '确认提交', path: '/step/review' },
]

export default function StepCard({ stepIndex, title, subtitle, children, onNext, nextLabel = '下一步 →', isValid = true }) {
  const navigate = useNavigate()
  const prevPath = stepIndex > 0 ? STEPS_META[stepIndex - 1].path : '/template'

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <ProgressBar steps={STEPS_META.map(s => s.label)} currentStep={stepIndex} />

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 page-enter">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mb-6">{subtitle}</p>}
          <div className="space-y-5">{children}</div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate(prevPath)}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← 返回
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${isValid
              ? 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
