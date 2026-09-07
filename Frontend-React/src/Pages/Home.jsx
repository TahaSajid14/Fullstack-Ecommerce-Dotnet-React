import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../Services/ProductService';
import { getCategories } from '../Services/CategoryService';
import ProductCard from '../Components/ProductCard';
import {
  ArrowRight, Sparkles, Star, Zap, Shield, Truck, RotateCcw,
  HeartHandshake, ChevronRight, TrendingUp, Package
} from 'lucide-react';

/* ---------- ANIMATED COUNTER ---------- */
const AnimCounter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1200;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ---------- FEATURE CARD ---------- */
const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px',
    transition: 'var(--trans-slow)',
    animationDelay: `${delay}ms`,
    animation: 'fadeSlideUp 0.6s ease forwards',
    opacity: 0,
    cursor: 'default',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-6px)';
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.boxShadow = `0 12px 40px ${color}22`;
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = 'var(--border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <div style={{
      width: 52, height: 52, borderRadius: 'var(--radius-md)',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color,
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  </div>
);

/* ---------- STAT CARD ---------- */
const StatCard = ({ value, suffix, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
      fontWeight: 900,
      background: 'var(--grad-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      <AnimCounter end={value} suffix={suffix} />
    </div>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{label}</p>
  </div>
);

/* ---------- HOME COMPONENT ---------- */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pData, cData] = await Promise.all([
          getProducts({ page: 1, pageSize: 4 }),
          getCategories(),
        ]);
        setFeaturedProducts(pData.products || []);
        setCategories(cData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryEmojis = ['🖥️','📱','🎧','📷','⌚','🎮','👗','🏠','💄','🏋️'];

  return (
    <div>
      {/* ============================
          HERO SECTION
          ============================ */}
      <section style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex', alignItems: 'center',
        padding: '60px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Hero background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--grad-hero)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

            {/* LEFT: Text */}
            <div style={{ animation: 'fadeSlideUp 0.8s ease forwards' }}>
              {/* Eyebrow badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                marginBottom: '24px',
                fontSize: '0.8rem', fontWeight: 700,
                color: 'var(--primary-light)',
                letterSpacing: '0.5px',
              }}>
                <Sparkles size={14} />
                ✨ Discover Premium Quality · 2026 Collection
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                lineHeight: 1.1,
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}>
                Shop Smarter,<br />
                <span style={{
                  background: 'var(--grad-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Live Better.</span>
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 460,
                marginBottom: '36px',
              }}>
                Explore thousands of premium products curated for the modern lifestyle. From electronics to fashion — all in one place, with free shipping & secure payments.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link to="/products" className="btn btn-primary btn-xl" style={{ gap: '10px' }}>
                  Explore Store <ArrowRight size={20} />
                </Link>
                <Link to="/products" className="btn btn-outline btn-xl">
                  🔥 View Deals
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: '⭐', text: '4.9 / 5 Rating' },
                  { icon: '🛡️', text: 'Secure Checkout' },
                  { icon: '🚚', text: 'Free Shipping' },
                ].map(s => (
                  <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    <span>{s.icon}</span> {s.text}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Floating glass card showcase */}
            <div style={{ position: 'relative', animation: 'float 6s ease-in-out infinite', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2xl)',
                padding: '32px',
                maxWidth: 400, width: '100%',
                boxShadow: 'var(--shadow-glow)',
                position: 'relative',
              }}>
                {/* Top badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
                    ⭐ 4.9 Rating
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
                    🔥 Hot Deal
                  </span>
                </div>

                {/* Image placeholder with gradient */}
                <div style={{
                  height: 180, borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 50%, rgba(236,72,153,0.15) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', fontSize: '4rem',
                  border: '1px solid var(--border)',
                }}>
                  🛍️
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Premium Collection
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Rs. 2,999
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>Rs. 4,999</span>
                </div>

                <Link to="/products" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Shop Now <ArrowRight size={16} />
                </Link>

                {/* Bottom dispatch badge */}
                <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ⚡ Fast Dispatch · 🛡️ 30-Day Return
                </div>

                {/* Floating accent badges */}
                <div style={{
                  position: 'absolute', top: -14, right: -14,
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--glow-primary)',
                  animation: 'pulseGlow 2.5s ease-in-out infinite',
                  fontSize: '1.4rem',
                }}>
                  💎
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          STATS BAR
          ============================ */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '40px 0',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px' }}>
            <StatCard value={50000} suffix="+" label="Happy Customers" />
            <StatCard value={10000} suffix="+" label="Products Listed" />
            <StatCard value={500} suffix="+" label="Brands" />
            <StatCard value={99} suffix="%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* ============================
          FEATURES
          ============================ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Why ShopLux?</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '12px' }}>
              Shopping Made <span className="gradient-text">Delightful</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>
              We believe shopping should be easy, secure, and enjoyable.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
            <FeatureCard icon={<Truck size={22} />} title="Free Express Shipping" desc="Complimentary shipping on all orders above Rs. 2,000." color="#06b6d4" delay={0} />
            <FeatureCard icon={<Shield size={22} />} title="Bank-Grade Security" desc="Your payment data is 100% encrypted and secure." color="#6366f1" delay={100} />
            <FeatureCard icon={<RotateCcw size={22} />} title="30-Day Guarantee" desc="Not satisfied? Return anything within 30 days." color="#10b981" delay={200} />
            <FeatureCard icon={<HeartHandshake size={22} />} title="24/7 Support" desc="Our team is always here to help you around the clock." color="#ec4899" delay={300} />
          </div>
        </div>
      </section>

      {/* ============================
          CATEGORIES
          ============================ */}
      {categories.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--bg-surface)', padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="section-eyebrow">Browse By</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
                  Shop <span className="gradient-text">Categories</span>
                </h2>
              </div>
              <Link to="/products" className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {categories.map((cat, i) => (
                <Link key={cat.id} to={`/products`} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem', fontWeight: 600,
                  transition: 'var(--trans-base)',
                  animation: `popIn 0.4s ease ${i * 60}ms both`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                  e.currentTarget.style.color = 'var(--primary-light)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <span>{categoryEmojis[i % categoryEmojis.length]}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================
          FEATURED PRODUCTS
          ============================ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="section-eyebrow"><TrendingUp size={14} /> Trending Now</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
                Featured <span className="gradient-text">Products</span>
              </h2>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ gap: '6px' }}>
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {featuredProducts.map((product, i) => (
                <div key={product.id} style={{ animation: `fadeSlideUp 0.5s ease ${i * 80}ms both` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Package size={48} style={{ color: 'var(--text-muted)' }} /></div>
              <h3 style={{ color: 'var(--text-secondary)' }}>No products yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Check back soon for new arrivals!</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================
          PROMO BANNER
          ============================ */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '60px 48px',
            background: 'var(--grad-primary)',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'space-between', alignItems: 'center',
            gap: '32px',
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-glow)',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', bottom: -60, right: 100, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
                <Zap size={12} /> Limited Time Offer
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '8px', lineHeight: 1.2 }}>
                Up to 40% Off<br />Your First Order!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: 0 }}>
                Use code <strong style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: '6px' }}>WELCOME40</strong> at checkout.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 32px',
                background: '#fff', color: '#4f46e5',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 800, fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                transition: 'var(--trans-base)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)'; }}
              >
                Claim Offer <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
