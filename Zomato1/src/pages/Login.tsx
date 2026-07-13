import { useState, FormEvent, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  setData?: React.Dispatch<React.SetStateAction<{ isLoggedIn: boolean }>>
}

function Login({ setData }: LoginProps) {
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const userData = {
      mobile,
      password,
    }

    try {
      const response = await fetch("https://zomato-production-816f.up.railway.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed")
      }

      console.log(data)
      alert("Login Successful")

      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)

      if (setData) {
        setData((prevData: any) => ({ ...prevData, isLoggedIn: true }))
      }

      setMobile("")
      setPassword("")
      navigate("/")
    } catch (error: any) {
      console.error(error)
      alert(error.message || "Something went wrong during login!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 24, color: "#1c1c1c", marginBottom: 24, textAlign: 'center' }}>Login</h2>
      <div style={{ color: "#2e7d32", backgroundColor: "#edf7ed", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>Enter OTP</div>
      <form onSubmit={handleLogin}>
        <input
          type='tel'
          placeholder="mobile"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required style={inputStyle}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
          disabled={loading}
        />
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

const containerStyle: CSSProperties = {
  maxWidth: '400px',
  margin: '80px auto',
  padding: '32px',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  margin: '8px 0',
  border: '1.5px solid #e8e8e8',
  borderRadius: '8px',
  boxSizing: 'border-box',
  fontSize: '14px',
  fontFamily: 'inherit',
}

const btnStyle: CSSProperties = {
  width: '100%',
  backgroundColor: '#e23744',
  color: 'white',
  padding: '12px',
  margin: '16px 0 8px 0',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'inherit',
}

export default Login;