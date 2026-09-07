import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, Truck, RotateCcw, Mail, Phone, MapPin, Camera, MessageCircle, Users, Play } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      {/* Main Footer Grid */}
      <div className="container" style={{ padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '10px',
                background: 'var(--grad-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingBag size={18} color="#fff" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, fontSize: '1.3rem',
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>ShopLux</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '20px', color: 'var(--text-muted)' }}>
              Discover premium quality products curated for the modern lifestyle. Shop with confidence.
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: <Camera size={16} />, href: '#', label: 'Instagram' },
                { icon: <MessageCircle size={16} />, href: '#', label: 'Twitter' },
                { icon: <Users size={16} />, href: '#', label: 'Facebook' },
                { icon: <Play size={16} />, href: '#', label: 'YouTube' },
              ].map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'var(--trans-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shop</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products', label: 'New Arrivals' },
                { to: '/products', label: 'Best Sellers' },
                { to: '/products', label: 'Sale & Deals' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Help Center', 'Track My Order', 'Return Policy', 'Size Guide', 'Contact Us'].map(item => (
                <li key={item}>
                  <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <Mail size={14} />, text: 'hello@shoplux.com' },
                { icon: <Phone size={14} />, text: '0312-1311827' },
                { icon: <MapPin size={14} />, text: 'Karachi, Pakistan' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--primary-light)', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          marginBottom: '32px',
        }}>
          {[
            { icon: <Truck size={18} />, title: 'Free Shipping', sub: 'Orders over Rs. 2000' },
            { icon: <Shield size={18} />, title: 'Secure Payment', sub: 'SSL Encrypted' },
            { icon: <RotateCcw size={18} />, title: '30-Day Returns', sub: 'Hassle free' },
            { icon: <Heart size={18} />, title: '24/7 Support', sub: 'Always here to help' },
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'rgba(99,102,241,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary-light)', flexShrink: 0,
              }}>
                {b.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-primary)' }}>{b.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
            © {year} ShopLux. All rights reserved. Made with{' '}
            <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle', color: '#ec4899' }} /> by ShopLux Team.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
