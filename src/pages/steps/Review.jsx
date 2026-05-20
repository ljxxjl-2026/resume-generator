import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import ProgressBar from '@/components/ProgressBar'
import { generateAndDownload } from '@/utils/docxGenerator'
import { useState } from 'react'

const STEPS_LABELS = ['基本信息','教育背景','实习经历','获奖情况','技能特长','确认提交']

function Section({ title, editPath, children, warn }) {
  const navigate = useNavigate()
  return (
    <div className={`border rounded-2xl p-5 bg-white ${warn ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-1.5">
          {warn && <span className="text-orange-400 text-xs">⚠️</span>}
          {title}
        </h3>
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

function MissingField({ label }) {
  return (
    <div className="text-xs text-orange-400">未填写：{label}</div>
  )
}

export default function Review() {
  const navigate = useNavigate()
  const store = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const b = store.basic
  const e = store.education
  const basicMissing = [
    !b.name && '姓名',
    !b.phone && '手机号',
    !b.email && '邮箱',
  ].filter(Boolean)
  const eduMissing = [
    !e.school && '学校',
    !e.major && '专业',
  ].filter(Boolean)
  const canGenerate = basicMissing.length === 0 && eduMissing.length === 0

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      await generateAndDownload(store)
    } catch (err) {
      setError('生成失败：' + (err.message || '请检查网络或重试'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const photoToolUrl = `${import.meta.env.BASE_URL}photo-tool.html`

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <ProgressBar steps={STEPS_LABELS} currentStep={5} />

      <div className="flex-1 px-4 py-4 pb-40 space-y-4 max-w-xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold text-gray-900">✅ 确认你的信息</h2>
          <p className="text-sm text-gray-400 mt-1">检查无误后，点击下方按钮生成简历</p>
        </div>

        {/* validation banner */}
        {!canGenerate && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
            <p className="text-sm font-medium text-orange-700 mb-1">以下必填项还未填写，请返回补充：</p>
            {basicMissing.map(f => (
              <div key={f} className="text-xs text-orange-500 flex items-center gap-1">
                <span>·</span> 基本信息 → {f}
              </div>
            ))}
            {eduMissing.map(f => (
              <div key={f} className="text-xs text-orange-500 flex items-center gap-1">
                <span>·</span> 教育背景 → {f}
              </div>
            ))}
          </div>
        )}

        <Section title="基本信息" editPath="/step/basic" warn={basicMissing.length > 0}>
          <div className="space-y-1">
            {basicMissing.map(f => <MissingField key={f} label={f} />)}
            <Row label="姓名" value={b.name} />
            <Row label="手机" value={b.phone} />
            <Row label="邮箱" value={b.email} />
            <Row label="城市" value={b.city} />
            <Row label="意向岗位" value={b.expectedPosition} />
            <Row label="个人主页" value={b.portfolio} />
          </div>
        </Section>

        <Section title="教育背景" editPath="/step/education" warn={eduMissing.length > 0}>
          <div className="space-y-1">
            {eduMissing.map(f => <MissingField key={f} label={f} />)}
            <Row label="学校" value={e.school} />
            <Row label="专业" value={e.major} />
            <Row label="学历" value={e.degree} />
            <Row label="时间" value={e.enrollDate && `${e.enrollDate} — ${e.gradDate || '至今'}`} />
            <Row label="GPA" value={e.gpa} />
            <Row label="排名" value={e.rank} />
          </div>
        </Section>

        {store.experiences.length > 0 && (
          <Section title="实习 / 经历" editPath="/step/experience">
            <div className="space-y-3">
              {store.experiences.map((exp, i) => (
                <div key={exp.id} className="text-sm">
                  <div className="font-medium text-gray-800">{exp.name || `经历 ${i + 1}`}</div>
                  <div className="text-gray-400 text-xs">{exp.organization} {exp.startDate && `· ${exp.startDate}—${exp.endDate || '至今'}`}</div>
                  {exp.bullets.filter(Boolean).map((bb, j) => (
                    <div key={j} className="text-gray-600 text-xs mt-0.5">· {bb}</div>
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
                  <div className="font-medium text-gray-800">{a.name || `奖项 ${i + 1}`}</div>
                  <div className="text-gray-400 text-xs">{[a.level, a.date].filter(Boolean).join(' · ')}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="技能特长" editPath="/step/skills">
          <div className="space-y-1">
            {!store.skills.languages && !store.skills.computerSkills && !store.skills.hobbies && !store.skills.selfIntro
              ? <div className="text-xs text-gray-400">暂未填写，可返回补充</div>
              : <>
                  <Row label="语言" value={store.skills.languages} />
                  <Row label="技能" value={store.skills.computerSkills} />
                  <Row label="爱好" value={store.skills.hobbies} />
                  {store.skills.selfIntro && (
                    <div className="text-sm text-gray-700 mt-1 bg-gray-50 rounded-lg p-2">{store.skills.selfIntro}</div>
                  )}
                </>
            }
          </div>
        </Section>

        {/* Photo tool card */}
        <div className="p-4 rounded-2xl bg-[var(--accent-soft)] border border-pink-100 flex items-center gap-3">
          <span className="text-2xl">🪪</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">还需要处理证件照？</div>
            <div className="text-xs text-gray-500 mt-0.5">一键智能抠图 + 证件照裁剪工具</div>
          </div>
          <button
            onClick={() => window.open(photoToolUrl, '_blank')}
            className="text-xs px-3 py-1.5 bg-white border border-pink-200 rounded-lg
              text-[var(--accent)] font-medium hover:bg-pink-50 transition-colors whitespace-nowrap"
          >
            去处理 →
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center px-2">{error}</p>}
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
          disabled={loading || !canGenerate}
          title={!canGenerate ? '请先填写必填项（姓名、手机、邮箱、学校、专业）' : ''}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
            ${canGenerate && !loading
              ? 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? '⏳ 生成中...' : canGenerate ? '📥 生成并下载简历 (.docx)' : '请先补充必填项'}
        </button>
      </div>
    </div>
  )
}
