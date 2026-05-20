export default function HighlightTag({ children, color = 'yellow' }) {
  const cls = { yellow: 'hl', green: 'hl-green', pink: 'hl-pink', blue: 'hl-blue' }[color]
  return <span className={cls}>{children}</span>
}
