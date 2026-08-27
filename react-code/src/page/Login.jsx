import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Input from "../components/ui/Input"
import Btn from "../components/ui/Btn"
import { adminLogin_API } from "../services/admin.api"
import { useAuthContext } from "../context/AuthContext"

export default function Login() {

  const { Login } = useAuthContext()
  const navigate = useNavigate()

  const [error, seterror] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required")
      return
    }

    seterror(false)
    setLoading(true)

    try {
      const res = await adminLogin_API({
        email: form.email.trim(),
        password: form.password,
      })

      if (res?.data?.success) {
        localStorage.setItem("admin", JSON.stringify(res.data.data))
        toast.success(res.data.message || "Logged in successfully")
        Login(res.data.accessToken, res.data.data)
        //navigate("/students")  
      } else {
        toast.error(res?.data?.message || "Invalid credentials")
        seterror(res.data.message)

      }

    } catch (error) {
      console.error("Login error:", error)
      toast.error("Failed to login, please try again")
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-[#0a0b0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_55%)]" />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">EduTrack</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-[#111318] border border-white/6 rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
            {error && <p className="text-xs text-red-500">{error}</p>}
              <label className="text-xs text-zinc-500 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="admin@edutrack.io"
                value={form.email}
                onChange={set("email")}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                className="w-full"
              />
            </div>

            <Btn
              loading={loading}
              className="w-full justify-center mt-2"
              size="md"
            >
              Sign in
            </Btn>
          </form>
        </div>
      </div>
    </div>
  )
}
