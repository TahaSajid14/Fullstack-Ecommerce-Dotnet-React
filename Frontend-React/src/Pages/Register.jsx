import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../Services/AuthService';
import { useToast } from '../Context/ToastContext';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Sparkles } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [userData, setUserData] = useState({ firstName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (userData.password.length < 6) {
      showToast({ type: 'warning', title: 'Weak Password', message: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    try {
      await register(userData);
      showToast({ type: 'success', title: '🎉 Account Created!', message: `Welcome, ${userData.firstName}! Please sign in.` });
      navigate('/login');
    } catch (err) {
      showToast({ type: 'error', title: 'Registration Failed', message: err.response?.data || 'Please try a different email.' });
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
            background: 'var(--grad-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--glow-purple)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <UserPlus size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '6px' }}>
            Join ShopLux
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Create your free account today
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* First Name */}
          <div className="form-group">
            <label className="form-label">First Name</label>
            <div className="form-input-icon">
              <User className="input-icon" size={16} />
              <input
                className="form-input"
                type="text"
                name="firstName"
                placeholder="Your name"
                value={userData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
                value={userData.email}
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
                  placeholder="Min. 6 characters"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{ paddingRight: 44 }}
                />
              </div>
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'color 0.2s',
              }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {/* Password strength indicator */}
            {userData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 'var(--radius-full)',
                    width: userData.password.length >= 10 ? '100%' : userData.password.length >= 6 ? '60%' : '25%',
                    background: userData.password.length >= 10 ? 'var(--grad-success)' : userData.password.length >= 6 ? 'var(--grad-warm)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Strength: {userData.password.length >= 10 ? '💪 Strong' : userData.password.length >= 6 ? '🆗 Medium' : '⚠️ Weak'}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center', marginTop: '4px' }}>
            {loading ? (
              <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
            ) : <UserPlus size={18} />}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Already have an account?</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
          Sign In Instead
        </Link>
      </div>
    </div>
  );
};

export default Register;