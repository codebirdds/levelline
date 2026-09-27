import { useSelector } from "react-redux";
import StatCard from "./StatCard";

export default function Dashboard() {
  const products   = useSelector((s) => s.adminProducts?.items?.length || 0);
  const categories = useSelector((s) => s.categories?.items?.length || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products"   value={products}    hint="Live catalog" tone="brand" />
        <StatCard label="Total Categories" value={categories}  hint="Organized by group" tone="ink" />
        <StatCard label="Total Orders"     value="—"           hint="Coming soon" tone="accent" />
        <StatCard label="Revenue"          value="—"           hint="Coming soon" tone="danger" />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-sm font-semibold text-ink mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/products"   className="text-sm font-medium px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition">Manage Products</a>
          <a href="/admin/categories" className="text-sm font-medium px-4 py-2 border border-border rounded-md hover:border-brand hover:text-brand transition">Manage Categories</a>
        </div>
      </div>
    </div>
  );
}