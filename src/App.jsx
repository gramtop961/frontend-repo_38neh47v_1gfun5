import React, { useMemo, useState } from 'react';
import Catalog from './components/Catalog.jsx';
import SalesForm from './components/SalesForm.jsx';
import CustomerInsights from './components/CustomerInsights.jsx';
import Dashboard from './components/Dashboard.jsx';
import { LayoutGrid, Presentation, Users, ShoppingCart } from 'lucide-react';

function App() {
  // Example data to simulate Salesforce objects: Products, Customers, Sales
  const [products, setProducts] = useState([
    { id: 'p1', name: 'Slim Fit Indigo', category: 'Slim Fit', sizes: ['28','30','32','34','36'], colors: ['Indigo','Black'], price: 59.99, stock: 18 },
    { id: 'p2', name: 'Regular Fit Blue', category: 'Regular Fit', sizes: ['30','32','34','36','38'], colors: ['Blue'], price: 49.99, stock: 24 },
    { id: 'p3', name: 'Skinny Jet Black', category: 'Skinny', sizes: ['26','28','30','32','34'], colors: ['Black','Grey'], price: 64.99, stock: 7 },
    { id: 'p4', name: 'Bootcut Classic', category: 'Bootcut', sizes: ['30','32','34','36'], colors: ['Dark Blue'], price: 69.99, stock: 9 },
    { id: 'p5', name: 'Relaxed Vintage', category: 'Regular Fit', sizes: ['32','34','36','38','40'], colors: ['Light Blue'], price: 54.99, stock: 12 },
    { id: 'p6', name: 'Super Skinny Grey', category: 'Skinny', sizes: ['28','30','32'], colors: ['Grey'], price: 62.5, stock: 6 },
  ]);

  const [customers] = useState([
    { id: 'c1', name: 'Ava Johnson', email: 'ava@example.com' },
    { id: 'c2', name: 'Liam Carter', email: 'liam@example.com' },
    { id: 'c3', name: 'Mia Patel', email: 'mia@example.com' },
  ]);

  const [sales, setSales] = useState([
    // seed data over recent days to populate charts
    { id: 's1', productId: 'p1', qty: 2, discount: 10, total: 107.98, date: new Date(Date.now() - 1000*60*60*24*8).toISOString(), customerId: 'c1' },
    { id: 's2', productId: 'p2', qty: 1, discount: 0, total: 49.99, date: new Date(Date.now() - 1000*60*60*24*7).toISOString(), customerId: 'c2' },
    { id: 's3', productId: 'p3', qty: 3, discount: 5, total: 185.22, date: new Date(Date.now() - 1000*60*60*24*5).toISOString(), customerId: 'c3' },
    { id: 's4', productId: 'p4', qty: 1, discount: 0, total: 69.99, date: new Date(Date.now() - 1000*60*60*24*3).toISOString(), customerId: 'c2' },
    { id: 's5', productId: 'p2', qty: 2, discount: 0, total: 99.98, date: new Date(Date.now() - 1000*60*60*24*2).toISOString(), customerId: 'c1' },
    { id: 's6', productId: 'p6', qty: 1, discount: 0, total: 62.5, date: new Date(Date.now() - 1000*60*60*24*1).toISOString(), customerId: 'c1' },
  ]);

  // Derived: inventory counts for restock logic inside Dashboard
  const totalStock = useMemo(() => products.reduce((sum, p) => sum + p.stock, 0), [products]);

  function recordSale({ productId, qty, discount, customerId }) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const subtotal = product.price * qty;
    const total = Math.max(subtotal * (1 - (discount || 0) / 100), 0);
    const sale = {
      id: `s${Date.now()}`,
      productId,
      qty,
      discount: discount || 0,
      total: Number(total.toFixed(2)),
      date: new Date().toISOString(),
      customerId,
    };
    setSales((prev) => [sale, ...prev]);
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(p.stock - qty, 0) } : p)));
  }

  const [tab, setTab] = useState('dashboard');
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Presentation },
    { id: 'catalog', label: 'Catalog', icon: LayoutGrid },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">JR</div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Jeans Retail — Lightning Workspace</h1>
              <p className="text-xs text-slate-500">A streamlined Salesforce-style console for jeans operations</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-slate-600">Total on hand: <span className="font-semibold">{totalStock}</span> units</div>
        </div>
        <nav className="mx-auto max-w-7xl px-2 pb-2">
          <div className="flex gap-2 overflow-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  tab === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        {tab === 'dashboard' && <Dashboard sales={sales} products={products} />}
        {tab === 'catalog' && <Catalog products={products} />}
        {tab === 'sales' && (
          <div className="grid md:grid-cols-2 gap-6">
            <SalesForm products={products} customers={customers} onRecordSale={recordSale} />
            <div className="rounded-xl border border-slate-200 bg-white/60 p-5 backdrop-blur">
              <h3 className="font-semibold mb-3">Recent Sales</h3>
              <ul className="space-y-2 max-h-[420px] overflow-auto pr-2">
                {sales.slice(0, 10).map((s) => {
                  const p = products.find((x) => x.id === s.productId);
                  const c = customers.find((x) => x.id === s.customerId);
                  return (
                    <li key={s.id} className="grid grid-cols-[1fr,auto,auto] gap-3 text-sm items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{p ? p.name : 'Product'}</p>
                        <p className="text-xs text-slate-500">{new Date(s.date).toLocaleString()} — {c ? c.name : 'Customer'}</p>
                      </div>
                      <span className="text-slate-600">{s.qty}×</span>
                      <span className="font-semibold">${s.total.toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        {tab === 'customers' && (
          <CustomerInsights customers={customers} sales={sales} products={products} />
        )}
      </main>

      <footer className="mx-auto max-w-7xl p-6 text-xs text-slate-500">
        Example data and simple chart formulas included for demo purposes.
      </footer>
    </div>
  );
}

export default App;
