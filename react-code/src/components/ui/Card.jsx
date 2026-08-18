export default function Card({ children, className = '' }) {
  return <div className={`bg-[#111318] border border-white/6 rounded-xl ${className}`}>{children}</div>
}