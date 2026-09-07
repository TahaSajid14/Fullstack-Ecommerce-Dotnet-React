import { useEffect, useState } from "react";
import { addCategory } from "../Services/CategoryService";
import { getCategories } from "../Services/CategoryService";
import { useToast } from "../Context/ToastContext";
import AdminNav from "../Components/AdminNav";
import { Tags, Plus, LoaderCircle, Layers3 } from "lucide-react";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : (data.categories || []))).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();
    if (!categoryName) return;
    setSubmitting(true);
    try {
      const created = await addCategory({ name: categoryName });
      setCategories(current => [...current, created]);
      setName("");
      showToast({ type: 'success', title: 'Category added', message: `${categoryName} is ready to use.` });
    } catch (error) {
      console.error("Error adding category:", error);
      showToast({ type: 'error', message: 'Could not add this category. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <AdminNav />
        <header className="admin-page-header">
          <div>
            <div className="section-eyebrow"><Tags size={14} /> Catalog setup</div>
            <h1>Product <span className="gradient-text">Categories</span></h1>
            <p>Keep your storefront organized and easy to browse.</p>
          </div>
        </header>

        <div className="category-layout">
          <form className="glass-card category-form" onSubmit={handleSubmit}>
            <div className="category-icon"><Plus size={24} /></div>
            <h2>Create a category</h2>
            <p>Add a clear, customer-friendly name for a new product group.</p>
            <label className="form-label" htmlFor="category-name">Category name</label>
            <input id="category-name" className="form-input" type="text" placeholder="e.g. Home & Living" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoFocus required />
            <div className="category-form-footer">
              <span>{name.trim().length}/60</span>
              <button className="btn btn-primary" type="submit" disabled={submitting || !name.trim()}>
                {submitting ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />}
                {submitting ? 'Adding…' : 'Add Category'}
              </button>
            </div>
          </form>

          <section className="glass-card category-list">
            <div className="category-list-heading">
              <div><Layers3 size={20} /><h2>Existing categories</h2></div>
              <span className="badge badge-primary">{categories.length}</span>
            </div>
            {categories.length ? (
              <div className="category-chips">
                {categories.map((category, index) => (
                  <span className="category-chip" key={category.id ?? `${category.name}-${index}`}><span />{category.name}</span>
                ))}
              </div>
            ) : (
              <div className="category-empty"><Tags size={34} /><p>No categories found yet.</p></div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
