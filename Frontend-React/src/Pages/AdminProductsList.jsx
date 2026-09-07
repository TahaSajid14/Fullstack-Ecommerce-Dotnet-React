import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../Services/ProductService';
import { Link } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';
import { Edit3, Trash2, Plus, Package, ShieldCheck } from 'lucide-react';
import AdminNav from '../Components/AdminNav';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ pageSize: 100 });
        // API returns { products, totalPages, ... } or an array
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast({ type: 'success', title: 'Deleted', message: `"${name}" has been removed.` });
    } catch (err) {
      showToast({ type: 'error', message: 'Could not delete product.' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <AdminNav />
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', animation: 'fadeSlideUp 0.5s ease' }}>
          <div>
            <div className="section-eyebrow"><ShieldCheck size={14} /> Admin Panel</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '4px' }}>
              Manage <span className="gradient-text">Products</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{products.length} products total</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/category/add" className="btn btn-ghost" style={{ gap: '6px' }}>
              <Plus size={16} /> Add Category
            </Link>
            <Link to="/admin/products/add" className="btn btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} /> Add Product
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 68, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={52} color="var(--text-muted)" /></div>
            <h2 style={{ color: 'var(--text-secondary)' }}>No products yet</h2>
            <Link to="/admin/products/add" className="btn btn-primary btn-lg" style={{ marginTop: '8px', gap: '8px' }}>
              <Plus size={18} /> Add First Product
            </Link>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            animation: 'fadeSlideUp 0.5s ease 0.1s both',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 100px 90px 120px 130px',
              padding: '14px 20px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              <span>Image</span>
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Category</span>
              <span>Actions</span>
            </div>

            {/* Table Rows */}
            {products.map((product, i) => (
              <div key={product.id} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 100px 90px 120px 130px',
                padding: '16px 20px',
                alignItems: 'center',
                borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
                animation: `fadeSlideIn 0.3s ease ${i * 30}ms both`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Image */}
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={18} color="var(--text-muted)" />
                  )}
                </div>

                {/* Name */}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    #{product.id}
                  </div>
                </div>

                {/* Price */}
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Rs. {product.price?.toLocaleString()}
                </div>

                {/* Stock */}
                <div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem', fontWeight: 700,
                    ...(product.stock > 10
                      ? { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }
                      : product.stock > 0
                      ? { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }
                      : { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                    ),
                  }}>
                    {product.stock}
                  </span>
                </div>

                {/* Category */}
                <div>
                  {product.category?.name ? (
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{product.category.name}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/admin/products/edit/${product.id}`} className="btn btn-outline btn-sm" style={{ gap: '4px' }}>
                    <Edit3 size={13} /> Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    style={{ gap: '4px' }}
                  >
                    <Trash2 size={13} /> Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
