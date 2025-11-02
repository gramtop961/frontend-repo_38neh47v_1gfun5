import React, { useMemo } from 'react';
import { BarChart2, LineChart, Activity, AlertTriangle } from 'lucide-react';

function LineChartSimple({ points, height = 120, color = '#4f46e5' }) {
  if (!points.length) return <div className="h-[120px]" />;
  const maxY = Math.max(...points.map((p) => p.y), 1);
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const pad = 8;
  const w = 420;
  const h = height;
  const path = points
    .map((p, i) => {
      const x = pad + ((p.x - minX) / (maxX - minX || 1)) * (w - pad * 2);
      const y = h - pad - (p.y / maxY) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  const area = `${path} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[120px]">
      <path d={area} fill={`${color}20`} />
      <path d={path} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function Bars({ data, max = 1 }) {
  return (
    <div className="space-y-2">
      {data.map(({ label, value, color }) => (
        <div key={label} className="grid grid-cols-[140px,1fr,60px] items-center gap-2">
          <span className="text-sm text-slate-600 truncate" title={label}>{label}</span>
          <div className="h-2 rounded bg-slate-100 overflow-hidden">
            <div className="h-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color || '#0ea5e9' }} />
          </div>
          <span className="text-xs text-slate-500 text-right">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ sales, products }) {
  const totalsByDay = useMemo(() => {
    const byDay = {};
    sales.forEach((s) => {
      const d = new Date(s.date);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      byDay[key] = (byDay[key] || 0) + s.total;
    });
    const sorted = Object.entries(byDay)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([x, y]) => ({ x: Number(x), y }));
    return sorted;
  }, [sales]);

  const bestCategories = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      const p = products.find((x) => x.id === s.productId);
      if (!p) return;
      map[p.category] = (map[p.category] || 0) + s.qty;
    });
    const arr = Object.entries(map).map(([label, value], i) => ({ label, value, color: ['#0ea5e9','#22c55e','#f59e0b','#ef4444','#8b5cf6'][i%5] }));
    const max = Math.max(...arr.map((a) => a.value), 1);
    return { arr, max };
  }, [sales, products]);

  const bestSizes = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      const p = products.find((x) => x.id === s.productId);
      if (!p) return;
      const size = s.size || p.sizes[0];
      map[size] = (map[size] || 0) + s.qty;
    });
    const arr = Object.entries(map).map(([label, value], i) => ({ label, value, color: ['#06b6d4','#84cc16','#f97316','#e11d48','#6366f1'][i%5] }));
    const max = Math.max(...arr.map((a) => a.value), 1);
    return { arr, max };
  }, [sales, products]);

  const lowStock = products.filter((p) => p.stock <= 8);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalUnits = sales.reduce((sum, s) => sum + s.qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-emerald-600" />
        <h2 className="text-xl font-semibold tracking-tight">Sales Analysis & Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white/60 p-5">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-2xl font-semibold mt-1">${totalRevenue.toFixed(2)}</p>
          <LineChartSimple points={totalsByDay} />
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <LineChart className="h-4 w-4" />
            Total sales over time
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/60 p-5">
          <p className="text-sm text-slate-500">Best-selling Categories</p>
          <Bars data={bestCategories.arr} max={bestCategories.max} />
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <BarChart2 className="h-4 w-4" />
            Units sold by category
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/60 p-5">
          <p className="text-sm text-slate-500">Best-selling Sizes</p>
          <Bars data={bestSizes.arr} max={bestSizes.max} />
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <BarChart2 className="h-4 w-4" />
            Units sold by size
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/60 p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Inventory & Restock Alerts</p>
          {lowStock.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-4 w-4" /> {lowStock.length} low-stock items
            </span>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-2">Product</th>
                <th className="py-2">Category</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 text-slate-600">{p.category}</td>
                  <td className={`py-2 ${p.stock <= 8 ? 'text-red-600 font-semibold' : ''}`}>{p.stock}</td>
                  <td className="py-2">${p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Notes: Charts are driven by simple formulas — totals grouped by day for trend lines, sum of units per category/size for bars. Adjust thresholds to tune alerts.
      </div>
    </div>
  );
}
