import { NavLink } from 'react-router-dom';
import { LayoutGrid, PackagePlus, Tags, ClipboardList } from 'lucide-react';

const links = [
  { to: '/admin/products', label: 'Products', icon: LayoutGrid, end: true },
  { to: '/admin/products/add', label: 'Add Product', icon: PackagePlus },
  { to: '/admin/category/add', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
];

const AdminNav = () => (
  <nav className="admin-nav" aria-label="Admin navigation">
    <div className="admin-nav-label">Workspace</div>
    <div className="admin-nav-links">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
        >
          <Icon size={16} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default AdminNav;
