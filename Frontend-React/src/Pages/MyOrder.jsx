import { useEffect, useState } from 'react';
import { getMyOrders } from '../Services/OrderService';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, Hash } from 'lucide-react';

const statusConfig = {
  Pending:    { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', emoji: '⏳' },
  Processing: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', emoji: '⚙️' },
  Shipped:    { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', emoji: '🚚' },
  Delivered:  { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', emoji: '✅' },
  Cancelled:  { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', emoji: '❌' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: '36px', animation: 'fadeSlideUp 0.5s ease' }}>
          <div className="section-eyebrow"><Package size={14} /> Account</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '6px' }}>
            My <span className="gradient-text">Orders</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Track and manage your purchase history</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 style={{ color: 'var(--text-secondary)' }}>No orders yet</h2>
            <p style={{ color: 'var(--text-muted)' }}>Start shopping and your orders will appear here.</p>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '8px', gap: '8px' }}>
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              return (
                <div key={order.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  animation: `fadeSlideUp 0.4s ease ${i * 80}ms both`,
                  transition: 'var(--trans-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Order Header */}
                  <div style={{
                    padding: '20px 24px',
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                  }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                        <Hash size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-muted)' }}>Order</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{order.id}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '5px 14px', borderRadius: 'var(--radius-full)',
                        background: status.bg, color: status.color, border: `1px solid ${status.border}`,
                        fontSize: '0.8rem', fontWeight: 700,
                      }}>
                        {status.emoji} {order.status}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem',
                        background: 'var(--grad-primary)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}>
                        Rs. {order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.orderItems?.map(item => (
                      <div key={item.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        gap: '12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                            border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                          }}>
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Package size={20} color="var(--text-muted)" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              {item.product?.name || 'Product'}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', flexShrink: 0 }}>
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
