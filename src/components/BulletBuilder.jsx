export default function BulletBuilder({ bullets = [], onChange, prompt }) {
  const update = (i, val) => {
    const next = [...bullets]
    next[i] = val
    onChange(next)
  }
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i))
  const add = () => onChange([...bullets, ''])

  return (
    <div className="space-y-2">
      {prompt && (
        <p className="text-sm text-gray-500 mb-3">{prompt}</p>
      )}
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[var(--accent)] font-bold text-sm select-none">·</span>
          <input
            value={b}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`第 ${i + 1} 条描述...`}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
              focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
          />
          <button
            aria-label="删除"
            onClick={() => remove(i)}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-sm text-[var(--accent)] hover:underline mt-1 flex items-center gap-1"
      >
        + 添加一条
      </button>
    </div>
  )
}
