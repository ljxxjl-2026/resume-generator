import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'
import BulletBuilder from '@/components/BulletBuilder'

function ExperienceEntry({ entry, onUpdate, onRemove, index }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">经历 {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-xs text-gray-300 hover:text-red-400 transition-colors"
        >
          删除
        </button>
      </div>
      <TextInput
        label="经历名称"
        value={entry.name}
        onChange={(v) => onUpdate({ name: v })}
        placeholder="如：字节跳动产品实习 / 学生会副主席"
      />
      <TextInput
        label="机构/公司名称"
        value={entry.organization}
        onChange={(v) => onUpdate({ organization: v })}
        placeholder="如：字节跳动 / XX大学学生会"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="开始时间"
          value={entry.startDate}
          onChange={(v) => onUpdate({ startDate: v })}
          placeholder="2024.06"
        />
        <TextInput
          label="结束时间"
          value={entry.endDate}
          onChange={(v) => onUpdate({ endDate: v })}
          placeholder="2024.09 / 至今"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">你做了什么？取得了什么成果？</p>
        <BulletBuilder
          bullets={entry.bullets}
          onChange={(bullets) => onUpdate({ bullets })}
          prompt="💡 建议分点描述，每条以动词开头，如"负责…""优化…""完成…""
        />
      </div>
    </div>
  )
}

export default function Experience() {
  const navigate = useNavigate()
  const experiences = useResumeStore((s) => s.experiences)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)

  return (
    <StepCard
      stepIndex={2}
      title="💼 实习 / 项目 / 活动经历"
      subtitle="可以添加多段经历，建议 2-3 段，重质量"
      onNext={() => navigate('/step/awards')}
      isValid={true}
      nextLabel={experiences.length === 0 ? '跳过这步 →' : '下一步 →'}
    >
      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-300">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-sm">还没有添加经历，可以跳过</div>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((entry, i) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            index={i}
            onUpdate={(patch) => updateExperience(entry.id, patch)}
            onRemove={() => removeExperience(entry.id)}
          />
        ))}
      </div>

      <button
        onClick={addExperience}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl
          text-sm text-gray-400 hover:border-[var(--accent)] hover:text-[var(--accent)]
          transition-all"
      >
        + 添加一段经历
      </button>
    </StepCard>
  )
}
