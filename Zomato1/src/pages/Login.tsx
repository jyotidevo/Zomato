import { useState, FormEvent, CSSProperties } from 'react'

function Login() {
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState("")

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 24, color: "#1c1c1c", marginBottom: 24, textAlign: 'center' }}>Login</h2>
      <div style={{ color: "#2e7d32", backgroundColor: "#edf7ed", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>Enter OTP</div>
      <form onSubmit={handleLogin}>
        <input
          type='Mobile Number'
          placeholder="mobile"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>
          Login
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