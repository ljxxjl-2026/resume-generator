import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import ProgressBar from '@/components/ProgressBar'
import { generateAndDownload } from '@/utils/docxGenerator'
import { useState, useEffect } from 'react'

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
        <button onClick={() => navigate(editPath)} className="text-xs text-[var(--accent)] hover:underline">
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
  const setBasic = useResumeStore((s) => s.setBasic)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoImported, setPhotoImported] = useState(false)

  // Receive photo from photo-tool tab via postMessage (primary path)
  // or from localStorage (fallback when opener is unavailable)
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'resume-photo' && e.data?.dataUrl) {
        setBasic({ photoDataUrl: e.data.dataUrl })
        setPhotoImported(true)
        setTimeout(() => setPhotoImported(false), 4000)
      }
    }
    window.addEventListener('message', handleMessage)

    // Fallback: check localStorage (e.g., photo tool couldn't reach opener)
    const pending = localStorage.getItem('resume-photo-pending')
    if (pending) {
      setBasic({ photoDataUrl: pending })
      localStorage.removeItem('resume-photo-pending')
      setPhotoImported(true)
      setTimeout(() => setPhotoImported(false), 4000)
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const b = store.basic
  const e = store.education
  const basicMissing = [!b.name && '姓名', !b.phone && '手机号', !b.email && '邮箱'].filter(Boolean)
  const eduMissing = [!e.school && '学校', !e.major && '专业'].filter(Boolean)
  const canGenerate = basicMissing.length === 0 && eduMissing.length === 0

  const handleGenerate = async () => {
    setLoading(true); setError('')
    try { await generateAndDownload(store) }
    catch (err) { setError('生成失败：' + (err.message || '请检查网络或重试')); console.error(err) }
    finally { setLoading(false) }
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

        {/* Validation banner */}
        {!canGenerate && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
            <p className="text-sm font-medium text-orange-700 mb-1">以下必填项还未填写，请返回补充：</p>
            {basicMissing.map(f => <div key={f} className="text-xs text-orange-500">· 基本信息 → {f}</div>)}
            {eduMissing.map(f => <div key={f} className="text-xs text-orange-500">· 教育背景 → {f}</div>)}
          </div>
        )}

        {/* Photo import success */}
        {photoImported && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-2 text-sm text-green-700">
            ✅ 证件照已成功导入简历！
          </div>
        )}

        {/* Basic info + photo */}
        <Section title="基本信息" editPath="/step/basic" warn={basicMissing.length > 0}>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              {basicMissing.map(f => <div key={f} className="text-xs text-orange-400">未填写：{f}</div>)}
              <Row label="姓名" value={b.name} />
              <Row label="手机" value={b.phone} />
              <Row label="邮箱" value={b.email} />
              <Row label="城市" value={b.city} />
              <Row label="出生年月" value={b.birthdate} />
              <Row label="政治面貌" value={b.politicalStatus} />
              <Row label="意向岗位" value={b.expectedPosition} />
            </div>
            {/* Photo preview */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {b.photoDataUrl
                ? (
                  <div className="relative group">
                    <img
                      src={b.photoDataUrl}
                      alt="证件照"
                      className="w-16 h-[90px] object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      onClick={() => setBasic({ photoDataUrl: '' })}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-gray-200
                        rounded-full text-gray-400 hover:text-red-400 text-xs leading-none
                        opacity-0 group-hover:opacity-100 transition-opacity"
                      title="移除照片"
                    >×</button>
                  </div>
                )
                : (
                  <div className="w-16 h-[90px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-200
                    flex flex-col items-center justify-center text-gray-300 gap-1">
                    <span className="text-xl">🪪</span>
                    <span className="text-[10px] leading-tight text-center">一寸照</span>
                  </div>
                )
              }
              <button
                onClick={() => window.open(photoToolUrl, '_blank')}
                className="text-[10px] text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                {b.photoDataUrl ? '重新处理' : '去处理 →'}
              </button>
            </div>
          </div>
        </Section>

        <Section title="教育背景" editPath="/step/education" warn={eduMissing.length > 0}>
          <div className="space-y-1">
            {eduMissing.map(f => <div key={f} className="text-xs text-orange-400">未填写：{f}</div>)}
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
            {!store.skills.languages && !store.skills.computerSkills
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
            <div className="text-sm font-medium text-gray-800">
              {b.photoDataUrl ? '证件照已就绪 ✓' : '还没有处理证件照？'}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {b.photoDataUrl
                ? '照片将自动嵌入简历右上角'
                : '用证件照工具处理后，点「发送到简历」即可自动回填'}
            </div>
          </div>
          {!b.photoDataUrl && (
            <button
              onClick={() => window.open(photoToolUrl, '_blank')}
              className="text-xs px-3 py-1.5 bg-white border border-pink-200 rounded-lg
                text-[var(--accent)] font-medium hover:bg-pink-50 transition-colors whitespace-nowrap"
            >
              去处理 →
            </button>
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center px-2">{error}</p>}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
        <button onClick={() => navigate('/step/skills')} className="text-sm text-gray-400 hover:text-gray-700">
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
