import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import ProgressBar from '@/components/ProgressBar'
import { generateAndDownload } from '@/utils/docxGenerator'
import { useState } from 'react'

const STEPS_LABELS = ['基本信息','教育背景','实习经历','获奖情况','技能特长','确认提交']

function Section({ title, editPath, children }) {
  const navigate = useNavigate()
  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => navigate(editPath)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          编辑
        </button>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export default function Review() {
  const navigate = useNavigate()
  const store = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      await generateAndDownload(store)
    } catch (e) {
      setError('生成失败，请检查是否所有必填项均已填写。')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <ProgressBar steps={STEPS_LABELS} currentStep={5} />

      <div className="flex-1 px-4 py-4 pb-32 space-y-4 max-w-xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold text-gray-900">✅ 确认你的信息</h2>
          <p className="text-sm text-gray-400 mt-1">检查无误后，点击下方按钮生成简历</p>
        </div>

        <Section title="基本信息" editPath="/step/basic">
          <div className="space-y-1">
            <Row label="姓名" value={store.basic.name} />
            <Row label="手机" value={store.basic.phone} />
            <Row label="邮箱" value={store.basic.email} />
            <Row label="城市" value={store.basic.city} />
            <Row label="意向岗位" value={store.basic.expectedPosition} />
          </div>
        </Section>

        <Section title="教育背景" editPath="/step/education">
          <div className="space-y-1">
            <Row label="学校" value={store.education.school} />
            <Row label="专业" value={store.education.major} />
            <Row label="学历" value={store.education.degree} />
            <Row label="时间" value={store.education.enrollDate && `${store.education.enrollDate} — ${store.education.gradDate || '至今'}`} />
            <Row label="GPA" value={store.education.gpa} />
          </div>
        </Section>

        {store.experiences.length > 0 && (
          <Section title="实习 / 经历" editPath="/step/experience">
            <div className="space-y-3">
              {store.experiences.map((e, i) => (
                <div key={e.id} className="text-sm">
                  <div className="font-medium text-gray-800">{e.name || `经历 ${i+1}`}</div>
                  <div className="text-gray-400 text-xs">{e.organization} · {e.startDate}—{e.endDate}</div>
                  {e.bullets.filter(Boolean).map((b, j) => (
                    <div key={j} className="text-gray-600 text-xs mt-0.5">· {b}</div>
                  ))}
                </div>
              ))}
            </div>
          </Section>
        )}

        {store.awards.length > 0 && (
          <Section title="获奖经历" editPath="/step/awards">
            <div className="space-y-2">
              {store.awards.map((a, i) => (
                <div key={a.id} className="text-sm">
                  <div className="font-medium text-gray-800">{a.name || `奖项 ${i+1}`}</div>
                  <div className="text-gray-400 text-xs">{a.level} · {a.date}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="技能特长" editPath="/step/skills">
          <div className="space-y-1">
            <Row label="语言" value={store.skills.languages} />
            <Row label="技能" value={store.skills.computerSkills} />
            <Row label="爱好" value={store.skills.hobbies} />
          </div>
        </Section>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
        <button
          onClick={() => navigate('/step/skills')}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← 返回
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm
            hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? '⏳ 生成中...' : '📥 生成并下载简历 (.docx)'}
        </button>
      </div>
    </div>
  )
}
