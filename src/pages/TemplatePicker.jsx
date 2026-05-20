import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { TEMPLATES, shuffleTemplates } from '@/constants/templates'

function MiniPreview({ layout, accentColor }) {
  const accent = accentColor
  if (layout === 'single') return (
    <div className="w-full h-32 bg-gray-50 rounded-lg p-3 space-y-1.5">
      <div className="w-1/2 h-2.5 rounded-full" style={{ background: accent, opacity: 0.8 }} />
      <div className="w-1/3 h-1.5 bg-gray-200 rounded-full" />
      <div className="h-px bg-gray-200 my-1" />
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
  if (layout === 'sidebar') return (
    <div className="w-full h-32 bg-gray-50 rounded-lg flex overflow-hidden">
      <div className="w-1/4 h-full" style={{ background: accent, opacity: 0.15 }} />
      <div className="flex-1 p-2 space-y-1.5">
        <div className="w-3/4 h-2 rounded-full" style={{ background: accent, opacity: 0.7 }} />
        <div className="h-px bg-gray-200" />
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-gray-200 rounded-full" />
          <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )
  // academic
  return (
    <div className="w-full h-32 bg-gray-50 rounded-lg overflow-hidden">
      <div className="h-8 flex items-center px-3" style={{ background: accent, opacity: 0.85 }}>
        <div className="w-1/2 h-2 bg-white rounded-full opacity-80" />
      </div>
      <div className="p-3 space-y-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-3/5 h-1.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export default function TemplatePicker() {
  const navigate = useNavigate()
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [list, setList] = useState(TEMPLATES)
  const [selected, setSelected] = useState(null)

  const handleShuffle = () => setList(shuffleTemplates())

  const handleSelect = (tpl) => {
    setTemplateId(tpl.id)
    navigate('/step/basic')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 block transition-colors"
      >
        ← 返回首页
      </button>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">选一个模板</h2>
        <p className="text-gray-400 text-sm mt-1 mb-6">
          先预览一下风格，后续仍可更换
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {list.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelected(tpl.id)}
              className={`
                bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all
                ${selected === tpl.id
                  ? 'border-[var(--accent)] shadow-md'
                  : 'border-transparent shadow-sm hover:border-gray-200'
                }
              `}
            >
              <MiniPreview layout={tpl.previewLayout} accentColor={tpl.accentColor} />
              <div className="mt-3">
                <div className="font-semibold text-gray-900 text-sm">{tpl.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{tpl.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShuffle}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-500
              hover:border-gray-400 transition-colors"
          >
            🔀 换一批
          </button>
          <button
            onClick={() => selected && handleSelect(list.find(t => t.id === selected))}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all
              ${selected
                ? 'bg-[var(--accent)] text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            选这个 →
          </button>
        </div>
      </div>
    </div>
  )
}
