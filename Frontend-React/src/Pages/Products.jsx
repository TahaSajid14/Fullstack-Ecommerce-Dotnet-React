import React, { useState, useEffect } from 'react';
import { getProducts } from '../Services/ProductService';
import { getCategories } from '../Services/CategoryService';
import ProductCard from '../Components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, RotateCcw, Package } from 'lucide-react';

const SkeletonCard = () => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="skeleton skeleton-text" style={{ width: '70%' }} />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
      <div className="skeleton skeleton-text" style={{ width: '50%' }} />
      <div className="skeleton" style={{ height: 36, borderRadius: 'var(--radius-md)' }} />
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadProducts = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getProducts({
        search, categoryId, minPrice, maxPrice, sortBy, page, pageSize: 9, ...params,
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [page]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleApplyFilters = () => {
    if (page === 1) loadProducts();
    else setPage(1);
  };

  const handleResetFilters = () => {
    setSearch(''); setCategoryId(''); setMinPrice(''); setMaxPrice(''); setSortBy('');
    setPage(1);
    loadProducts({ search: '', categoryId: '', minPrice: '', maxPrice: '', sortBy: '', page: 1 });
  };

  const hasFilters = search || categoryId || minPrice || maxPrice || sortBy;

  const sortOptions = [
    { value: '', label: '⭐ Default' },
    { value: 'price-low', label: '💰 Price: Low to High' },
    { value: 'price-high', label: '💎 Price: High to Low' },
    { value: 'name-az', label: '🔤 Name: A–Z' },
    { value: 'name-za', label: '🔤 Name: Z–A' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* PAGE HEADER */}
        <div style={{ marginBottom: '36px', animation: 'fadeSlideUp 0.5s ease' }}>
          <div className="section-eyebrow"><Package size={14} /> Our Catalog</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '8px' }}>
            Discover <span className="gradient-text">Products</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>
            Browse our curated collection of premium products.
          </p>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          marginBottom: '28px',
          animation: 'fadeSlideUp 0.5s ease 0.1s both',
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

            {/* SEARCH */}
            <div style={{ flex: '1 1 240px' }} className="form-input-icon">
              <Search className="input-icon" size={16} />
              <input
                className="form-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>

            {/* CATEGORY */}
            <div style={{ flex: '1 1 160px' }}>
              <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* SORT */}
            <div style={{ flex: '1 1 180px' }}>
              <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* FILTER TOGGLE (price) */}
            <button className="btn btn-ghost btn-sm" onClick={() => setFiltersOpen(o => !o)} style={{ gap: '6px', flexShrink: 0 }}>
              <SlidersHorizontal size={15} />
              {filtersOpen ? 'Hide' : 'Price Filter'}
            </button>

            {/* APPLY */}
            <button className="btn btn-primary btn-sm" onClick={handleApplyFilters} style={{ flexShrink: 0, gap: '6px' }}>
              <Search size={14} /> Search
            </button>

            {/* RESET */}
            {hasFilters && (
              <button className="btn btn-danger btn-sm" onClick={handleResetFilters} style={{ flexShrink: 0, gap: '6px' }}>
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>

          {/* PRICE FILTER EXPAND */}
          {filtersOpen && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', animation: 'fadeSlideUp 0.3s ease', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px' }}>
                <label className="form-label">Min Price (Rs.)</label>
                <input className="form-input" type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label className="form-label">Max Price (Rs.)</label>
                <input className="form-input" type="number" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} />
              </div>
            </div>
          )}

          {/* ACTIVE FILTER PILLS */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
              {search && (
                <span className="badge badge-primary" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => { setSearch(''); }}>
                  Search: "{search}" <X size={12} />
                </span>
              )}
              {categoryId && (
                <span className="badge badge-purple" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => setCategoryId('')}>
                  Category: {categories.find(c => String(c.id) === String(categoryId))?.name} <X size={12} />
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="badge badge-success" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                  Price: Rs.{minPrice || 0} – Rs.{maxPrice || '∞'} <X size={12} />
                </span>
              )}
              {sortBy && (
                <span className="badge badge-warning" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => setSortBy('')}>
                  Sort: {sortOptions.find(o => o.value === sortBy)?.label} <X size={12} />
                </span>
              )}
            </div>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[1,2,3,4,5,6,7,8,9].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 style={{ color: 'var(--text-secondary)' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
            <button className="btn btn-primary" onClick={handleResetFilters} style={{ marginTop: '8px' }}>
              <RotateCcw size={16} /> Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing page {page} of {totalPages} • {products.length} products
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {products.map((product, i) => (
                <div key={product.id} style={{ animation: `fadeSlideUp 0.4s ease ${i * 50}ms both` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{ gap: '4px' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || (n >= page - 2 && n <= page + 2))
              .map((n, idx, arr) => (
                <React.Fragment key={n}>
                  {idx > 0 && arr[idx - 1] !== n - 1 && (
                    <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                  )}
                  <button
                    onClick={() => setPage(n)}
                    style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-md)',
                      border: '1.5px solid',
                      fontWeight: 700, fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'var(--trans-fast)',
                      ...(n === page ? {
                        background: 'var(--grad-primary)',
                        borderColor: 'transparent',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                      } : {
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                      }),
                    }}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))
            }

            <button
              className="btn btn-ghost btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{ gap: '4px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
