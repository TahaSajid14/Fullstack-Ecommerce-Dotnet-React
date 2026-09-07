import { useEffect, useState } from 'react';
import { getCategories } from '../Services/CategoryService';
import { addProduct } from '../Services/ProductService';
import { useToast } from '../Context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, ShieldCheck, Eye } from 'lucide-react';
import AdminNav from '../Components/AdminNav';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: ''
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = e => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        categoryId: Number(product.categoryId),
      });
      showToast({ type: 'success', title: '🎉 Product Added!', message: `"${product.name}" is now live in the store.` });
      setProduct({ name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' });
      navigate('/admin/products');
    } catch (err) {
      showToast({ type: 'error', title: 'Failed', message: 'Could not add product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => String(c.id) === String(product.categoryId));

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 1000 }}>
        <AdminNav />
        <div style={{ marginBottom: '32px', animation: 'fadeSlideUp 0.5s ease' }}>
          <div className="section-eyebrow"><ShieldCheck size={14} /> Admin Panel</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '4px' }}>
            Add <span className="gradient-text">Product</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Fill in the details to add a new product to your store.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
          {/* FORM */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            animation: 'fadeSlideUp 0.5s ease 0.1s both',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" type="text" name="name" placeholder="e.g. Wireless Headphones Pro" value={product.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" placeholder="Describe your product..." value={product.description} onChange={handleChange} rows={4} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (Rs.) *</label>
                  <input className="form-input" type="number" name="price" placeholder="0.00" value={product.price} onChange={handleChange} required min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input className="form-input" type="number" name="stock" placeholder="0" value={product.stock} onChange={handleChange} required min={0} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" type="url" name="imageUrl" placeholder="https://example.com/image.jpg" value={product.imageUrl} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" name="categoryId" value={product.categoryId} onChange={handleChange} required>
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/products')} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, gap: '8px', justifyContent: 'center' }}>
                  {loading ? (
                    <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                  ) : <Plus size={18} />}
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>

          {/* LIVE PREVIEW CARD */}
          <div style={{ animation: 'fadeSlideUp 0.5s ease 0.2s both' }}>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
              <Eye size={14} /> Live Preview
            </div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              {/* Image preview */}
              <div style={{
                height: 180, overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <Package size={48} color="var(--text-muted)" />
                )}
                {selectedCategory && (
                  <span style={{ position: 'absolute', bottom: 10, left: 10, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--grad-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                    {selectedCategory.name}
                  </span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: product.name ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: product.name ? 'normal' : 'italic' }}>
                  {product.name || 'Product name...'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || 'Description appears here...'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Rs. {product.price || '0'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700 }}>
                    <span className="pulse-dot pulse-dot-green" />
                    <span style={{ color: '#34d399' }}>{product.stock || 0} in stock</span>
                  </div>
                </div>
                <div className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', pointerEvents: 'none', opacity: 0.7 }}>
                  Add to Cart (Preview)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
