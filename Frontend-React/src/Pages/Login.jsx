import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../Services/AuthService';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      showToast({ type: 'success', title: `Welcome back, ${data.user.firstName}!`, message: 'You have signed in successfully.' });
      navigate('/');
    } catch (err) {
      showToast({ type: 'error', title: 'Login Failed', message: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        padding: '48px 40px',
        boxShadow: 'var(--shadow-glow)',
        animation: 'popIn 0.4s ease',
        position: 'relative',
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 'var(--radius-lg)',
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--glow-primary)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <Sparkles size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to your ShopLux account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-icon">
              <Mail className="input-icon" size={16} />
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <div className="form-input-icon">
                <Lock className="input-icon" size={16} />
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 44 }}
                />
              </div>
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center', marginTop: '4px' }}>
            {loading ? (
              <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
            ) : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>New to ShopLux?</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <Link to="/register" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
          Create an Account
        </Link>

        {/* Demo hint */}
        <div style={{
          marginTop: '20px', padding: '12px 16px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.775rem', color: 'var(--text-muted)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          💡 <strong style={{ color: 'var(--primary-light)' }}>Demo:</strong> Register with any email to try the store
        </div>
      </div>
    </div>
  );
};

export default Login;