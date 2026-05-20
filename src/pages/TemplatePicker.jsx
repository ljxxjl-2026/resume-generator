import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { TEMPLATES } from '@/constants/templates'

function TemplatePreview({ id, accentColor }) {
  if (id === 'job-general') return (
    <div className="w-full h-48 bg-white rounded-xl border border-gray-100 overflow-hidden text-[6px] leading-tight select-none">
      {/* header bar */}
      <div className="px-3 pt-3 pb-2 border-b border-gray-100">
        <div className="font-bold text-[9px]" style={{ color: accentColor }}>张 三</div>
        <div className="text-gray-400 mt-0.5">📱 138-0000-0000 &nbsp;✉ zhang@mail.com &nbsp;📍 北京</div>
        <div className="text-gray-500 mt-0.5">意向岗位：产品实习生</div>
      </div>
      {/* body */}
      <div className="px-3 py-2 space-y-2">
        <div>
          <div className="font-semibold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: accentColor }}>教育背景</div>
          <div className="flex justify-between text-gray-700">
            <span>北京大学 · 计算机科学（本科）</span><span className="text-gray-400">2021.09—2025.06</span>
          </div>
          <div className="text-gray-400">GPA 3.8 / 4.0 &nbsp;·&nbsp; 专业前 5%</div>
        </div>
        <div>
          <div className="font-semibold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: accentColor }}>实习经历</div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">产品实习生 · 字节跳动</span><span className="text-gray-400">2024.06—2024.09</span>
          </div>
          <div className="text-gray-500">· 负责 XX 功能需求分析与原型设计</div>
          <div className="text-gray-500">· 推动迭代上线，用户留存提升 12%</div>
        </div>
        <div>
          <div className="font-semibold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: accentColor }}>技能特长</div>
          <div className="text-gray-500">Python · Figma · Excel（高级）&nbsp;|&nbsp; 英语 CET-6</div>
        </div>
      </div>
    </div>
  )

  if (id === 'club-apply') return (
    <div className="w-full h-48 bg-white rounded-xl border border-gray-100 overflow-hidden text-[6px] leading-tight select-none flex">
      {/* sidebar */}
      <div className="w-16 flex-shrink-0 flex flex-col items-center pt-3 pb-2 px-1" style={{ background: accentColor + '18' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold mb-1" style={{ background: accentColor }}>张</div>
        <div className="font-bold text-[7px] text-gray-800">张 三</div>
        <div className="text-gray-400 mt-1 text-center">138-0000-0000</div>
        <div className="text-gray-400 text-center">zhang@mail.com</div>
        <div className="mt-2 font-semibold text-[6px]" style={{ color: accentColor }}>技能</div>
        <div className="text-gray-500 text-center mt-0.5">Photoshop</div>
        <div className="text-gray-500 text-center">排版设计</div>
        <div className="text-gray-500 text-center">团队协作</div>
      </div>
      {/* main */}
      <div className="flex-1 px-2 py-2 space-y-1.5">
        <div>
          <div className="font-semibold text-[7px] mb-0.5" style={{ color: accentColor }}>申请职位</div>
          <div className="text-gray-700">宣传部 · 设计干事</div>
        </div>
        <div>
          <div className="font-semibold text-[7px] mb-0.5" style={{ color: accentColor }}>教育背景</div>
          <div className="text-gray-700">北京大学 · 新闻传播（本科）</div>
          <div className="text-gray-400">2022.09—2026.06</div>
        </div>
        <div>
          <div className="font-semibold text-[7px] mb-0.5" style={{ color: accentColor }}>活动经历</div>
          <div className="text-gray-700 font-medium">校园摄影大赛 · 志愿者</div>
          <div className="text-gray-500">· 负责现场布置与摄影记录</div>
          <div className="text-gray-500">· 整理素材完成宣传推文</div>
        </div>
        <div>
          <div className="font-semibold text-[7px] mb-0.5" style={{ color: accentColor }}>自我介绍</div>
          <div className="text-gray-500">热爱创意设计，具备良好团队意识…</div>
        </div>
      </div>
    </div>
  )

  // postgrad-apply
  return (
    <div className="w-full h-48 bg-white rounded-xl border border-gray-100 overflow-hidden text-[6px] leading-tight select-none">
      {/* header */}
      <div className="px-3 py-2 text-white text-center" style={{ background: accentColor }}>
        <div className="font-bold text-[10px]">张 三</div>
        <div className="text-[6px] opacity-90 mt-0.5">北京大学 · 计算机科学硕士在读 &nbsp;|&nbsp; 138-0000-0000 &nbsp;|&nbsp; zhang@pku.edu.cn</div>
      </div>
      <div className="px-3 py-1.5 space-y-1.5">
        <div>
          <div className="font-bold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: '#333' }}>教育经历</div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800">北京大学 &nbsp;<span className="font-normal text-gray-500">计算机科学（硕士）</span></span>
            <span className="text-gray-400">2022.09—2025.06</span>
          </div>
          <div className="text-gray-400">研究方向：自然语言处理 &nbsp;·&nbsp; GPA 3.9/4.0</div>
        </div>
        <div>
          <div className="font-bold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: '#333' }}>科研经历</div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800">NLP 实验室科研助理</span>
            <span className="text-gray-400">2023.03—至今</span>
          </div>
          <div className="text-gray-500">· 参与国家自然科学基金项目研究</div>
          <div className="text-gray-500">· 发表 CCF-B 类论文 1 篇（第二作者）</div>
        </div>
        <div>
          <div className="font-bold text-[7px] border-b pb-0.5 mb-1" style={{ borderColor: accentColor, color: '#333' }}>获奖情况</div>
          <div className="flex justify-between">
            <span className="text-gray-700">国家奖学金</span><span className="text-gray-400">2023.10</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatePicker() {
  const navigate = useNavigate()
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [selected, setSelected] = useState(null)

  const handleConfirm = () => {
    if (!selected) return
    const tpl = TEMPLATES.find(t => t.id === selected)
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

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">选一个模板</h2>
        <p className="text-gray-400 text-sm mt-1 mb-6">点击卡片预览，选好后点「就这个 →」</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelected(tpl.id)}
              className={`
                bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all
                ${selected === tpl.id
                  ? 'border-[var(--accent)] shadow-lg scale-[1.02]'
                  : 'border-transparent shadow-sm hover:border-gray-200 hover:shadow-md'
                }
              `}
            >
              <TemplatePreview id={tpl.id} accentColor={tpl.accentColor} />
              <div className="mt-3">
                <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: tpl.accentColor }}
                  />
                  {tpl.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{tpl.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all
              ${selected
                ? 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            就这个 →
          </button>
        </div>
      </div>
    </div>
  )
}
