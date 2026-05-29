'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RevenueData {
  target: number;
  achieved: number;
  profit: number;
  loss: number;
}

interface RevenueWidgetProps {
  onDataChange?: (data: RevenueData) => void;
}

export default function RevenueWidget({ onDataChange }: RevenueWidgetProps) {
  const [data, setData] = useState<RevenueData>({
    target: 5000000,
    achieved: 4200000,
    profit: 850000,
    loss: 150000,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RevenueData>({ ...data });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('org_revenue_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setFormData(parsed);
        onDataChange?.(parsed);
      } catch (e) {
        console.error('Failed to parse saved revenue data', e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData(formData);
    localStorage.setItem('org_revenue_data', JSON.stringify(formData));
    setIsEditing(false);
    onDataChange?.(formData);
  };

  const percentage = Math.min(Math.round((data.achieved / data.target) * 100), 100);

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-2 hover:shadow-elevation-3 transition-smooth relative overflow-hidden group">
      {/* Background visual effect */}
      <div className="absolute -right-16 -top-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Icon name="CurrencyDollarIcon" size={22} variant="outline" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">Revenue Milestone</h2>
            <p className="text-[10px] text-muted-foreground font-caption">
              Target tracking and operational gains
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...data });
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted-foreground/10 text-foreground border border-border/60 rounded-lg text-xs font-caption font-semibold transition-smooth"
        >
          <Icon name="PencilSquareIcon" size={14} variant="outline" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Progress Gauge */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-background/40 rounded-2xl border border-border/40 relative">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-muted"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-primary transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-heading font-black text-foreground">
                {percentage}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold font-caption">
                Achieved
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground font-caption">Performance Status</p>
            <p
              className={`text-xs font-semibold ${percentage >= 80 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-error'}`}
            >
              {percentage >= 80
                ? 'Excellent Delivery'
                : percentage >= 50
                  ? 'On Track'
                  : 'Action Required'}
            </p>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          <div className="bg-background/60 p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-smooth">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider font-caption">
              Target Revenue
            </p>
            <p className="text-lg font-heading font-extrabold text-foreground">
              {formatCurrency(data.target)}
            </p>
          </div>

          <div className="bg-background/60 p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-smooth">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider font-caption">
              Achieved Revenue
            </p>
            <p className="text-lg font-heading font-extrabold text-foreground">
              {formatCurrency(data.achieved)}
            </p>
          </div>

          <div className="bg-success/5 p-4 rounded-xl border border-success/20 hover:border-success/30 transition-smooth">
            <p className="text-[10px] uppercase font-bold text-success mb-1 tracking-wider font-caption">
              Net Profit
            </p>
            <p className="text-lg font-heading font-extrabold text-success">
              {formatCurrency(data.profit)}
            </p>
          </div>

          <div className="bg-error/5 p-4 rounded-xl border border-error/20 hover:border-error/30 transition-smooth">
            <p className="text-[10px] uppercase font-bold text-error mb-1 tracking-wider font-caption">
              Total Loss
            </p>
            <p className="text-lg font-heading font-extrabold text-error">
              {formatCurrency(data.loss)}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-elevation-5 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <h3 className="font-heading font-bold text-base text-foreground">
                Edit Revenue Figures
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    Target Revenue ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    Achieved Revenue ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.achieved}
                    onChange={(e) => setFormData({ ...formData, achieved: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    Net Profit ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.profit}
                    onChange={(e) => setFormData({ ...formData, profit: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    Total Loss ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.loss}
                    onChange={(e) => setFormData({ ...formData, loss: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-caption font-semibold text-foreground hover:bg-muted transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-caption font-semibold hover:opacity-90 transition-smooth shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
