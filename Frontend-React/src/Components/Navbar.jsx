import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import {
  ShoppingBag, Home, Package, Sun, Moon, Menu, X,
  LogOut, User, ShieldCheck, ShoppingCart, ClipboardList,
  Sparkles, ChevronDown, Plus, Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, cartUpdated } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/products', label: 'Products', icon: <Package size={16} /> },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 'var(--z-navbar)',
        background: scrolled ? 'var(--bg-navbar)' : 'var(--bg-navbar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '72px',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--glow-primary)',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}>
              <ShoppingBag size={20} color="#fff" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800, fontSize: '1.4rem',
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}>ShopLux</span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive(link.to) ? '#fff' : 'var(--text-secondary)',
                background: isActive(link.to) ? 'var(--grad-primary)' : 'transparent',
                transition: 'var(--trans-fast)',
                boxShadow: isActive(link.to) ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--trans-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* CART ICON */}
            {user && (
              <Link to="/cart" style={{
                position: 'relative',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'var(--trans-base)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <ShoppingCart size={17} style={{ animation: cartUpdated ? 'cartBounce 0.5s ease' : 'none' }} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: 'var(--grad-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 18, height: 18,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-body)',
                    animation: cartUpdated ? 'cartBounce 0.5s ease' : 'none',
                  }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* USER AREA */}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px 6px 6px',
                  cursor: 'pointer',
                  transition: 'var(--trans-fast)',
                  color: 'var(--text-primary)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                  }}>
                    {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.firstName}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    minWidth: 220,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'popIn 0.2s ease',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}>
                    {/* User info header */}
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--grad-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, color: '#fff', fontSize: '0.85rem',
                        }}>
                          {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.firstName}</div>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: user.role === 'Admin' ? 'rgba(168,85,247,0.2)' : 'rgba(99,102,241,0.2)',
                            color: user.role === 'Admin' ? '#c084fc' : '#818cf8',
                            border: `1px solid ${user.role === 'Admin' ? 'rgba(168,85,247,0.3)' : 'rgba(99,102,241,0.3)'}`,
                          }}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nav items */}
                    {[
                      { to: '/orders', label: 'My Orders', icon: <ClipboardList size={15} /> },
                      ...(user.role === 'Admin' ? [
                        { to: '/admin/products', label: 'Manage Products', icon: <Settings size={15} /> },
                        { to: '/admin/products/add', label: 'Add Product', icon: <Plus size={15} /> },
                        { to: '/admin/category/add', label: 'Add Category', icon: <Plus size={15} /> },
                        { to: '/admin/orders', label: 'Manage Orders', icon: <ShieldCheck size={15} /> },
                      ] : []),
                    ].map(item => (
                      <Link key={item.to} to={item.to} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 16px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'var(--trans-fast)',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <span style={{ color: 'var(--primary-light)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 16px', width: '100%',
                      background: 'transparent', border: 'none',
                      color: '#f87171', cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 600,
                      transition: 'var(--trans-fast)', textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
                <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* HAMBURGER (mobile) */}
            <button onClick={() => setMobileOpen(o => !o)} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              width: 40, height: 40,
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)',
            }} className="mobile-menu-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
          zIndex: 99,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            width: 280, height: '100%',
            padding: '24px 16px',
            animation: 'fadeSlideIn 0.25s ease',
            overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>

            {user && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px', marginBottom: '16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: '#fff',
                }}>
                  {user.firstName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.firstName}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{user.role}</span>
                </div>
              </div>
            )}

            {[
              { to: '/', label: 'Home', icon: <Home size={17} /> },
              { to: '/products', label: 'Products', icon: <Package size={17} /> },
              ...(user ? [
                { to: '/cart', label: 'Cart', icon: <ShoppingCart size={17} /> },
                { to: '/orders', label: 'My Orders', icon: <ClipboardList size={17} /> },
              ] : []),
              ...(user?.role === 'Admin' ? [
                { to: '/admin/products', label: 'Manage Products', icon: <Settings size={17} /> },
                { to: '/admin/products/add', label: 'Add Product', icon: <Plus size={17} /> },
                { to: '/admin/category/add', label: 'Add Category', icon: <Plus size={17} /> },
                { to: '/admin/orders', label: 'Manage Orders', icon: <ShieldCheck size={17} /> },
              ] : []),
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', marginBottom: '4px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive(link.to) ? '#fff' : 'var(--text-secondary)',
                background: isActive(link.to) ? 'var(--grad-primary)' : 'transparent',
                fontWeight: 600, fontSize: '0.925rem',
                transition: 'var(--trans-fast)',
              }}>
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

            {user ? (
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', width: '100%',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.925rem',
              }}>
                <LogOut size={17} />
                Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center' }}>Log In</Link>
                <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
