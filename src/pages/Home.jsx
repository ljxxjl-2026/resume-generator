import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import HighlightTag from '@/components/HighlightTag'

export default function Home() {
  const navigate = useNavigate()
  const reset = useResumeStore((s) => s.reset)

  const handleStart = () => {
    reset()
    navigate('/template')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[var(--bg)]">
      {/* Logo area */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-4">📄✨</div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          简历，<HighlightTag color="yellow">轻松</HighlightTag>搞定
        </h1>
        <p className="mt-3 text-gray-500 text-base max-w-xs">
          问答式生成，5 分钟完成一份专属简历
        </p>
      </div>

      {/* Entry cards */}
      <div className="w-full max-w-sm space-y-4">
        {/* Entry 1 */}
        <button
          onClick={handleStart}
          className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100
            hover:border-[var(--accent)] hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🚀</span>
            <div>
              <div className="font-semibold text-gray-900 text-base group-hover:text-[var(--accent)] transition-colors">
                从零开始制作简历
              </div>
              <div className="text-sm text-gray-400 mt-1">
                选模板 → 问答填写 → 下载 .docx
              </div>
            </div>
          </div>
        </button>

        {/* Entry 2 — disabled */}
        <div className="w-full bg-gray-50 rounded-2xl p-6 text-left border border-dashed border-gray-200 opacity-60 cursor-not-allowed">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📁</span>
            <div>
              <div className="font-semibold text-gray-400 text-base">
                我已有简历模板
              </div>
              <div className="text-sm text-gray-300 mt-1">
                上传模板智能填充 · 即将推出
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-gray-300 text-center">
        所有数据仅存储在你的浏览器中，不会上传服务器
      </p>
    </div>
  )
}
