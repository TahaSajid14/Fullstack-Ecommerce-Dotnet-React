import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../Services/ProductService';
import { addToCart } from '../Services/CartService';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';
import {
  ShoppingCart, ArrowLeft, ChevronRight, Star, Truck,
  Shield, RotateCcw, Minus, Plus, Package, Heart, Share2
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { incrementCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      incrementCart(quantity);
      showToast({ type: 'success', title: 'Added to Cart!', message: `${quantity}x ${product.name} added to cart.` });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Could not add to cart. Please try again.' });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          <div className="skeleton" style={{ height: 460, borderRadius: 'var(--radius-xl)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton skeleton-text" style={{ width: '30%' }} />
            <div className="skeleton skeleton-text" style={{ width: '80%', height: 40 }} />
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
            <div className="skeleton" style={{ height: 80 }} />
            <div className="skeleton" style={{ height: 52, borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h2>Product Not Found</h2>
          <p>This product doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '12px' }}>
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    </div>
  );

  const inStock = product.stock > 0;
  const stockPercent = Math.min(100, (product.stock / 50) * 100);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* BREADCRUMB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >Products</Link>
          {product.category?.name && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--text-muted)' }}>{product.category.name}</span>
            </>
          )}
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* PRODUCT LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

          {/* LEFT: IMAGE */}
          <div style={{ animation: 'fadeSlideUp 0.5s ease' }}>
            <div style={{
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.06))',
              aspectRatio: '1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {product.imageUrl && !imgError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ) : (
                <Package size={80} color="var(--text-muted)" />
              )}
              {/* Category badge */}
              {product.category?.name && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  padding: '5px 14px', borderRadius: 'var(--radius-full)',
                  background: 'var(--grad-primary)', color: '#fff',
                  fontSize: '0.75rem', fontWeight: 700,
                  backdropFilter: 'blur(8px)',
                }}>
                  {product.category.name}
                </span>
              )}
              {/* Wishlist */}
              <button
                onClick={() => setWishlisted(w => !w)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'var(--trans-base)',
                }}
              >
                <Heart size={18} fill={wishlisted ? '#ec4899' : 'none'} color={wishlisted ? '#ec4899' : '#fff'} />
              </button>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div style={{ animation: 'fadeSlideUp 0.5s ease 0.15s both' }}>
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= 4 ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>4.0 (128 reviews)</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2rem',
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Rs. {product.price?.toLocaleString()}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>Best Price</span>
            </div>

            <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '24px' }}>
              {product.description || 'Premium quality product with superior craftsmanship and materials.'}
            </p>

            {/* Stock meter */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span className={`pulse-dot ${inStock ? 'pulse-dot-green' : 'pulse-dot-red'}`} />
                  <span style={{ color: inStock ? '#34d399' : '#f87171' }}>
                    {inStock ? `${product.stock} units in stock` : 'Out of Stock'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock Level</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  width: `${stockPercent}%`,
                  background: stockPercent > 50 ? 'var(--grad-success)' : stockPercent > 20 ? 'var(--grad-warm)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                {/* Quantity */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden', background: 'var(--bg-card)',
                }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '12px 14px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '12px 16px', fontWeight: 700, minWidth: 40, textAlign: 'center', fontSize: '1rem', color: 'var(--text-primary)' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    style={{ padding: '12px 14px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{ flex: 1, justifyContent: 'center', minWidth: 180 }}
                >
                  {adding ? (
                    <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                  ) : <ShoppingCart size={18} />}
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>

                {/* Share */}
                <button className="btn btn-ghost btn-icon" title="Share" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast({ type: 'info', message: 'Link copied!' }); }}>
                  <Share2 size={16} />
                </button>
              </div>
            )}

            {!inStock && (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                ⚠️ This product is currently out of stock.
              </div>
            )}

            {/* Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free delivery on orders above Rs. 2,000', color: '#06b6d4' },
                { icon: <RotateCcw size={16} />, text: '30-day hassle-free returns & exchanges', color: '#10b981' },
                { icon: <Shield size={16} />, text: '2-year manufacturer warranty included', color: '#6366f1' },
              ].map(g => (
                <div key={g.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: g.color, flexShrink: 0 }}>{g.icon}</span>
                  {g.text}
                </div>
              ))}
            </div>

            {/* Back button */}
            <Link to="/products" className="btn btn-ghost" style={{ marginTop: '24px', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Products
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;