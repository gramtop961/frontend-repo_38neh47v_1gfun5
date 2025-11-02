import React from 'react';
import { User, Heart, Clock } from 'lucide-react';

export default function CustomerInsights({ customers, sales, products }) {
  const byCustomer = customers.map((c) => {
    const custSales = sales.filter((s) => s.customerId === c.id);
    const total = custSales.reduce((sum, s) => sum + s.total, 0);
    const last = custSales.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const favCat = (() => {
      const counts = {};
      custSales.forEach((s) => {
        const p = products.find((x) => x.id === s.productId);
        if (!p) return;
        counts[p.category] = (counts[p.category] || 0) + s.qty;
      });
      const entries = Object.entries(counts);
      if (!entries.length) return '—';
      return entries.sort((a, b) => b[1] - a[1])[0][0];
    })();

    return { ...c, total, last, favCat };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-rose-600" />
        <h2 className="text-xl font-semibold tracking-tight">Customer History</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {byCustomer.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white/60 p-5 backdrop-blur shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{c.name}</p>
              <span className="text-xs text-slate-500">{c.email}</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Total Spent</p>
                <p className="font-semibold">${c.total.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <div>
                  <p className="text-slate-500">Favorite</p>
                  <p className="font-medium">{c.favCat}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500">Last Purchase</p>
                  <p className="font-medium">{c.last ? new Date(c.last.date).toLocaleDateString() : '—'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Recent Purchases</p>
              <ul className="space-y-1 max-h-28 overflow-auto pr-1">
                {sales
                  .filter((s) => s.customerId === c.id)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 4)
                  .map((s) => {
                    const p = products.find((x) => x.id === s.productId);
                    return (
                      <li key={s.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{p ? p.name : 'Product'}</span>
                        <span className="text-slate-500">{s.qty} × ${p ? p.price.toFixed(2) : '0.00'}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
