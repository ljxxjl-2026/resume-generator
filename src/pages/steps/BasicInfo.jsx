import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'

export default function BasicInfo() {
  const navigate = useNavigate()
  const basic = useResumeStore((s) => s.basic)
  const setBasic = useResumeStore((s) => s.setBasic)

  const isValid = basic.name.trim() && basic.phone.trim() && basic.email.trim()

  return (
    <StepCard
      stepIndex={0}
      title="👋 先介绍一下你自己"
      subtitle="带 * 的是必填项，其他可以先跳过"
      onNext={() => navigate('/step/education')}
      isValid={!!isValid}
    >
      <TextInput
        label="姓名" required
        value={basic.name}
        onChange={(v) => setBasic({ name: v })}
        placeholder="请输入你的真实姓名"
      />
      <TextInput
        label="手机号" required type="tel"
        value={basic.phone}
        onChange={(v) => setBasic({ phone: v })}
        placeholder="11 位手机号"
      />
      <TextInput
        label="邮箱" required type="email"
        value={basic.email}
        onChange={(v) => setBasic({ email: v })}
        placeholder="常用邮箱，用于接收 HR 通知"
      />
      <TextInput
        label="所在城市"
        value={basic.city}
        onChange={(v) => setBasic({ city: v })}
        placeholder="如：北京、上海"
      />
      <TextInput
        label="出生年月"
        value={basic.birthdate}
        onChange={(v) => setBasic({ birthdate: v })}
        placeholder="如：2002.08"
      />
      <TextInput
        label="意向岗位"
        value={basic.expectedPosition}
        onChange={(v) => setBasic({ expectedPosition: v })}
        placeholder="如：产品实习生、市场营销"
      />
      <TextInput
        label="个人主页 / GitHub / 作品集"
        value={basic.portfolio}
        onChange={(v) => setBasic({ portfolio: v })}
        placeholder="（选填）粘贴链接"
      />

      {/* Photo tool shortcut */}
      <div className="mt-2 p-4 rounded-xl bg-[var(--accent-soft)] border border-pink-100 flex items-center gap-3">
        <span className="text-2xl">🪪</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">需要处理证件照？</div>
          <div className="text-xs text-gray-500 mt-0.5">用我们的裁剪工具快速搞定</div>
        </div>
        <button
          onClick={() => window.open('about:blank', '_blank')}
          className="text-xs px-3 py-1.5 bg-white border border-pink-200 rounded-lg text-[var(--accent)] font-medium hover:bg-pink-50 transition-colors"
        >
          去裁剪 →
        </button>
      </div>
    </StepCard>
  )
}
