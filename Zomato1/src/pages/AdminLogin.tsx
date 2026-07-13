import { useState, FormEvent, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface AdminLoginProps {
  setData?: React.Dispatch<React.SetStateAction<{ isLoggedIn: boolean }>>
}

function AdminLogin({ setData }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isEmail = identifier.includes('@');
    const userData = {
      [isEmail ? 'email' : 'mobile']: identifier,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      if (!data.user.isAdmin) {
        throw new Error('Access Denied: This account does not have administrator privileges.');
      }

      // Store credentials
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      if (setData) {
        setData((prevData: any) => ({ ...prevData, isLoggedIn: true }));
      }

      alert('Admin Authentication Successful');
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during administrative login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <div style={logoSectionStyle}>
          <span style={logoEmojiStyle}>🛡️</span>
          <h2 style={titleStyle}>Zomato Admin</h2>
          <p style={subtitleStyle}>Back-Office Control Center</p>
        </div>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <form onSubmit={handleAdminLogin}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Admin Identifier</label>
            <input
              type="text"
              placeholder="Admin Mobile or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={inputStyle}
              disabled={loading}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              disabled={loading}
            />
          </div>

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Authenticating Admin...' : 'Authorize Access'}
          </button>
        </form>

        <div style={footerStyle}>
          <p style={footerTextStyle}>Authorized access only. All actions are logged.</p>
          <button onClick={() => navigate('/')} style={backBtnStyle}>
            Return to User Application
          </button>
        </div>
      </div>
    </div>
  );
}

// Premium dark-themed styles
const pageContainerStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #09090e, #131320, #09090e)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: "'Inter', sans-serif",
};

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '24px',
  padding: '40px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
};

const logoSectionStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const logoEmojiStyle: CSSProperties = {
  fontSize: '48px',
  display: 'inline-block',
  marginBottom: '16px',
};

const titleStyle: CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 800,
  margin: '0 0 6px 0',
  letterSpacing: '-0.02em',
};

const subtitleStyle: CSSProperties = {
  color: 'rgba(255, 255, 255, 0.45)',
  fontSize: '13px',
  margin: '0',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const errorBannerStyle: CSSProperties = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.25)',
  color: '#f87171',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '1.4',
  marginBottom: '24px',
};

const fieldGroupStyle: CSSProperties = {
  marginBottom: '20px',
};

const labelStyle: CSSProperties = {
  display: 'block',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '14px 18px',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, background-color 0.2s',
};

const btnStyle: CSSProperties = {
  width: '100%',
  background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
  color: '#ffffff',
  padding: '14px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '12px',
  transition: 'all 0.2s',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  marginTop: '32px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  paddingTop: '24px',
};

const footerTextStyle: CSSProperties = {
  color: 'rgba(255, 255, 255, 0.35)',
  fontSize: '11px',
  margin: '0 0 16px 0',
  fontWeight: 500,
};

const backBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
};

export default AdminLogin;
