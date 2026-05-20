import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'

export default function Skills() {
  const navigate = useNavigate()
  const skills = useResumeStore((s) => s.skills)
  const setSkills = useResumeStore((s) => s.setSkills)

  return (
    <StepCard
      stepIndex={4}
      title="⚡ 技能 & 自我介绍"
      subtitle="展示你的工具能力和个人亮点"
      onNext={() => navigate('/step/review')}
      isValid={true}
    >
      <TextInput
        label="语言能力"
        value={skills.languages}
        onChange={(v) => setSkills({ languages: v })}
        placeholder="如：英语 CET-6（580 分）、日语 N3"
        hint="多种语言用顿号分隔"
      />
      <TextInput
        label="计算机 / 专业技能"
        value={skills.computerSkills}
        onChange={(v) => setSkills({ computerSkills: v })}
        placeholder="如：Python、Figma、Photoshop、Excel（高级）"
        hint="按熟练度排列，用顿号分隔"
      />
      <TextInput
        label="兴趣爱好（选填）"
        value={skills.hobbies}
        onChange={(v) => setSkills({ hobbies: v })}
        placeholder="如：摄影、跑步、读书"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          自我评价 / 求职信
          <span className="text-gray-400 font-normal ml-1 text-xs">（选填）</span>
        </label>
        <p className="text-xs text-gray-400">简短介绍你的核心优势，2-4 句即可</p>
        <textarea
          value={skills.selfIntro}
          onChange={(e) => setSkills({ selfIntro: e.target.value })}
          placeholder="如：具备扎实的产品思维和数据分析能力，在实习期间独立推动了……"
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
            focus:outline-none focus:border-[var(--accent)] transition-colors bg-white resize-none"
        />
      </div>
    </StepCard>
  )
}
