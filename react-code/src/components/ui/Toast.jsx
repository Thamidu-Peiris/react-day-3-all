import { useEffect } from "react"
import Icons from "./Icons"

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl shadow-emerald-900/40 animate-[slideUp_0.3s_ease]">
      <span className="bg-white/20 rounded-full p-0.5">{Icons.check}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">{Icons.x}</button>
    </div>
  )
}