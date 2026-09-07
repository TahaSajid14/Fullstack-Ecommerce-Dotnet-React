import { useEffect, useState } from 'react';
import { getCart, updateCartQuantity, removeFromCart } from '../Services/CartService';
import { checkout } from '../Services/OrderService';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';
import { useCart } from '../Context/CartContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Package, Shield, Truck, Tag } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setCount } = useCart();

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCartItems(data || []);
      setCount((data || []).reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartQuantity(id, quantity);
      const updated = cartItems.map(item => item.id === id ? { ...item, quantity } : item);
      setCartItems(updated);
      setCount(updated.reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      showToast({ type: 'error', message: 'Could not update quantity.' });
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      const updated = cartItems.filter(item => item.id !== id);
      setCartItems(updated);
      setCount(updated.reduce((s, i) => s + i.quantity, 0));
      showToast({ type: 'info', title: 'Removed', message: 'Item removed from cart.' });
    } catch (err) {
      showToast({ type: 'error', message: 'Could not remove item.' });
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const result = await checkout();
      showToast({ type: 'success', title: '🎉 Order Placed!', message: `Order #${result.orderId} confirmed! Total: Rs. ${result.total?.toLocaleString()}` });
      setCartItems([]);
      setCount(0);
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      showToast({ type: 'error', title: 'Checkout Failed', message: err.response?.data || 'Something went wrong. Please try again.' });
    } finally {
      setCheckingOut(false);
    }
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME40') {
      setPromoApplied(true);
      showToast({ type: 'success', title: '🎁 Promo Applied!', message: '40% discount applied to your order!' });
    } else {
      showToast({ type: 'error', title: 'Invalid Code', message: 'This promo code is not valid.' });
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = promoApplied ? subtotal * 0.4 : 0;
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal - discount + shipping;

  if (loading) return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px', animation: 'fadeSlideUp 0.5s ease' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '4px' }}>
            Shopping <span className="gradient-text">Cart</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {cartItems.length === 0 ? 'Your cart is empty' : `${cartItems.length} item(s) in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart size={56} color="var(--text-muted)" /></div>
            <h2 style={{ color: 'var(--text-secondary)' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)' }}>Start shopping to add items to your cart.</p>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '8px', gap: '8px' }}>
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

            {/* LEFT: CART ITEMS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item, i) => (
                <div key={item.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px',
                  display: 'flex', gap: '16px', alignItems: 'center',
                  animation: `fadeSlideUp 0.4s ease ${i * 60}ms both`,
                  transition: 'var(--trans-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  {/* Image */}
                  <div style={{
                    width: 80, height: 80, borderRadius: 'var(--radius-md)', flexShrink: 0, overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border)',
                  }}>
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={28} color="var(--text-muted)" />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                      Unit price: <strong style={{ color: 'var(--text-secondary)' }}>Rs. {item.product.price?.toLocaleString()}</strong>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} style={{ padding: '8px 11px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    ><Minus size={14} /></button>
                    <span style={{ padding: '8px 14px', fontWeight: 700, color: 'var(--text-primary)', minWidth: 36, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)} style={{ padding: '8px 11px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    ><Plus size={14} /></button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 90 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* Remove */}
                  <button onClick={() => handleRemove(item.id)} style={{ padding: '8px', background: 'none', border: '1px solid transparent', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--trans-fast)', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              position: 'sticky', top: 96,
              animation: 'fadeSlideUp 0.5s ease 0.2s both',
            }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '20px', fontSize: '1.25rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#34d399' }}>
                    <span>🎁 Promo (WELCOME40)</span>
                    <span>-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#34d399' : 'var(--text-secondary)' }}>
                    {shipping === 0 ? '🚀 FREE' : `Rs. ${shipping}`}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Add Rs. {(2000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

              {/* Promo Code */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Tag size={14} /> Promo Code
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="form-input"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    style={{ flex: 1, fontSize: '0.875rem' }}
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handlePromo}
                    disabled={promoApplied || !promoCode}
                    style={{ flexShrink: 0 }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCheckout}
                disabled={checkingOut}
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
              >
                {checkingOut ? (
                  <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                ) : <Shield size={18} />}
                {checkingOut ? 'Processing...' : 'Secure Checkout'}
              </button>

              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                {[{ icon: <Shield size={14} />, text: 'Secure' }, { icon: <Truck size={14} />, text: 'Fast Ship' }].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--primary-light)' }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;