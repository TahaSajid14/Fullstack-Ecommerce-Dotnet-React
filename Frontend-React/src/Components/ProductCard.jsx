import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star, Package } from 'lucide-react';
import { addToCart } from '../Services/CartService';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { incrementCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      incrementCart(1);
      showToast({ type: 'success', title: 'Added to Cart!', message: `${product.name} was added to your cart.` });
    } catch (err) {
      showToast({ type: 'error', title: 'Failed', message: 'Could not add product to cart.' });
    } finally {
      setAddingToCart(false);
    }
  };

  const inStock = product.stock > 0;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      transition: 'var(--trans-slow)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
      e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* WISHLIST BUTTON */}
      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(w => !w); }}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'var(--trans-base)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(236,72,153,0.12)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <Heart size={16} fill={wishlisted ? '#ec4899' : 'none'} color={wishlisted ? '#ec4899' : 'var(--text-muted)'} />
      </button>

      {/* IMAGE */}
      <div style={{
        height: 200, overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ fontSize: '3.5rem', opacity: 0.5 }}><Package size={60} color="var(--text-muted)" /></div>
        )}
        {/* Overlay badges */}
        <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: '6px' }}>
          {product.category?.name && (
            <span style={{
              padding: '3px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(99,102,241,0.85)',
              backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: '0.7rem', fontWeight: 700,
            }}>
              {product.category.name}
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Name + rating */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700, fontSize: '1rem',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= 4 ? '#f59e0b' : 'none'} color="#f59e0b" />
            ))}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>4.0</span>
          </div>
        </div>

        <p style={{
          fontSize: '0.8rem', color: 'var(--text-muted)',
          lineHeight: 1.5, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.description || 'Premium quality product.'}
        </p>

        {/* Price + Stock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, fontSize: '1.2rem',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Rs. {product.price?.toLocaleString()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700 }}>
            <span className={`pulse-dot ${inStock ? 'pulse-dot-green' : 'pulse-dot-red'}`} />
            <span style={{ color: inStock ? '#34d399' : '#f87171' }}>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || addingToCart}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {addingToCart ? (
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
            ) : (
              <ShoppingCart size={14} />
            )}
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <Link
            to={`/products/${product.id}`}
            className="btn btn-ghost btn-sm btn-icon"
            title="View details"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;