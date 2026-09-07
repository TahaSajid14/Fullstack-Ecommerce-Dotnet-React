import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../Services/OrderService';
import { useToast } from '../Context/ToastContext';
import { ShieldCheck, Package, Calendar, User, Hash } from 'lucide-react';
import AdminNav from '../Components/AdminNav';

const statusConfig = {
  Pending:    { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', emoji: '⏳' },
  Processing: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', emoji: '⚙️' },
  Shipped:    { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', emoji: '🚚' },
  Delivered:  { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', emoji: '✅' },
  Cancelled:  { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', emoji: '❌' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast({ type: 'success', title: 'Status Updated', message: `Order #${id} is now ${status}.` });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update order status.' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <AdminNav />
        <div style={{ marginBottom: '36px', animation: 'fadeSlideUp 0.5s ease' }}>
          <div className="section-eyebrow"><ShieldCheck size={14} /> Admin Panel</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '6px' }}>
            Manage <span className="gradient-text">Orders</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>View and update the status of all customer orders.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 style={{ color: 'var(--text-secondary)' }}>No orders yet</h2>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              return (
                <div key={order.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  animation: `fadeSlideUp 0.4s ease ${i * 60}ms both`,
                  transition: 'var(--trans-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{
                    padding: '20px 24px',
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {/* Order meta */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                        <Hash size={14} color="var(--primary-light)" />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Order #{order.id}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <User size={13} />
                        {order.user?.firstName} — {order.user?.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Total + status select */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Rs. {order.totalAmount?.toLocaleString()}
                      </span>
                      <div style={{ position: 'relative' }}>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '8px 36px 8px 12px',
                            fontSize: '0.82rem', fontWeight: 700,
                            background: status.bg,
                            color: status.color,
                            borderColor: status.border,
                            minWidth: 150,
                          }}
                        >
                          {Object.keys(statusConfig).map(s => (
                            <option key={s} value={s}>{statusConfig[s].emoji} {s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Order items summary */}
                  <div style={{ padding: '14px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.orderItems?.map(item => (
                      <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '4px 12px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        fontSize: '0.775rem', color: 'var(--text-muted)',
                      }}>
                        <Package size={11} />
                        {item.product?.name} × {item.quantity}
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

export default AdminOrders;
