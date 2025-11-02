import React, { useMemo, useState } from 'react';
import { CreditCard, Percent, PlusCircle } from 'lucide-react';

export default function SalesForm({ products, onRecordSale, customers }) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');

  const selected = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const priceAfter = useMemo(() => {
    if (!selected) return 0;
    const subtotal = selected.price * qty;
    const discounted = subtotal * (1 - discount / 100);
    return Math.max(discounted, 0);
  }, [selected, qty, discount]);

  function submit(e) {
    e.preventDefault();
    if (!selected) return;
    onRecordSale({ productId, qty: Number(qty), discount: Number(discount), customerId });
    setQty(1);
    setDiscount(0);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold tracking-tight">Record a Sale</h2>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-200 bg-white/60 p-5 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Customer</span>
            <select
              className="rounded-lg border-slate-200 focus:ring-2 focus:ring-indigo-500"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Product</span>
            <select
              className="rounded-lg border-slate-200 focus:ring-2 focus:ring-indigo-500"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price.toFixed(2)} ({p.stock} in stock)
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Quantity</span>
            <input
              type="number"
              min={1}
              max={selected ? selected.stock : 999}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-lg border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Discount (%)</span>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                min={0}
                max={90}
                step={1}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="pl-9 w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-600">Total after discount</p>
          <p className="text-lg font-semibold">${priceAfter.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={!selected || qty < 1 || qty > (selected?.stock || 0)}
          className="inline-flex items-center gap-2 justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <PlusCircle className="h-5 w-5" />
          Add Sale
        </button>
      </form>
    </div>
  );
}
