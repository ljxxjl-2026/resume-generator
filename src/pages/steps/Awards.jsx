import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'
import SelectInput from '@/components/SelectInput'

const LEVEL_OPTIONS = ['国家级', '省级', '市级', '校级', '院级', '其他']

function AwardEntry({ award, onUpdate, onRemove, index }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-3 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">奖项 {index + 1}</span>
        <button onClick={onRemove} className="text-xs text-gray-300 hover:text-red-400 transition-colors">
          删除
        </button>
      </div>
      <TextInput
        label="奖项名称"
        value={award.name}
        onChange={(v) => onUpdate({ name: v })}
        placeholder="如：国家奖学金 / 全国大学生数学建模竞赛一等奖"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="获奖时间"
          value={award.date}
          onChange={(v) => onUpdate({ date: v })}
          placeholder="如：2023.11"
        />
        <SelectInput
          label="级别"
          value={award.level}
          onChange={(v) => onUpdate({ level: v })}
          options={LEVEL_OPTIONS}
        />
      </div>
      <TextInput
        label="补充说明（选填）"
        value={award.description}
        onChange={(v) => onUpdate({ description: v })}
        placeholder="如：全国 500 强队伍中排名第 3"
      />
    </div>
  )
}

export default function Awards() {
  const navigate = useNavigate()
  const awards = useResumeStore((s) => s.awards)
  const addAward = useResumeStore((s) => s.addAward)
  const updateAward = useResumeStore((s) => s.updateAward)
  const removeAward = useResumeStore((s) => s.removeAward)

  return (
    <StepCard
      stepIndex={3}
      title="🏆 获奖 & 荣誉经历"
      subtitle="奖学金、竞赛、荣誉称号都可以填"
      onNext={() => navigate('/step/skills')}
      isValid={true}
      nextLabel={awards.length === 0 ? '跳过这步 →' : '下一步 →'}
    >
      {awards.length === 0 && (
        <div className="text-center py-8 text-gray-300">
          <div className="text-4xl mb-2">🎖️</div>
          <div className="text-sm">还没有添加奖项，可以跳过</div>
        </div>
      )}

      <div className="space-y-4">
        {awards.map((a, i) => (
          <AwardEntry
            key={a.id}
            award={a}
            index={i}
            onUpdate={(patch) => updateAward(a.id, patch)}
            onRemove={() => removeAward(a.id)}
          />
        ))}
      </div>

      <button
        onClick={addAward}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl
          text-sm text-gray-400 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
      >
        + 添加一个奖项
      </button>
    </StepCard>
  )
}
