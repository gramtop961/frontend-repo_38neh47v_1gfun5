import React from 'react';
import { Tag, PackageSearch } from 'lucide-react';

function StockBadge({ qty }) {
  const low = qty <= 8;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        low ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {low ? 'Low stock' : 'In stock'}
    </span>
  );
}

export default function Catalog({ products }) {
  const categories = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageSearch className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold tracking-tight">Product Catalog</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="rounded-xl border border-slate-200 bg-white/60 backdrop-blur p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-slate-500" />
                <h3 className="font-semibold">{category}</h3>
              </div>
              <span className="text-xs text-slate-500">{items.length} styles</span>
            </div>
            <div className="space-y-4">
              {items.map((p) => (
                <div key={p.id} className="rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-slate-500">${p.price.toFixed(2)}</p>
                    </div>
                    <StockBadge qty={p.stock} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Sizes</p>
                      <p className="font-medium">{p.sizes.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Colors</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.colors.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
                          >
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.toLowerCase() }} />
                            <span className="text-xs">{c}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500">In Stock</p>
                      <p className="font-semibold">{p.stock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
