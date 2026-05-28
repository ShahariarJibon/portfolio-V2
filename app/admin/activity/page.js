"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, ArrowLeft, Save, X, GitCommit, Users, Star } from "lucide-react";

const ICON_OPTIONS = ["GitCommit", "Users", "Star", "GitBranch", "GitPullRequest", "GitFork"];

export default function AdminActivity() {
  const [data, setData] = useState({ stats: [], languages: [] });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [editing, setEditing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    setAuthenticated(true);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await fetch("/api/admin/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); router.push("/admin"); return; }
      const d = await res.json();
      setData(d);
    } catch {} finally { setLoading(false); }
  };

  const t = () => localStorage.getItem("admin_token");

  const saveStat = async (vals) => {
    const tok = t();
    if (editing.id === "new") {
      await fetch("/api/admin/activity", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ type: "stat", ...vals }),
      });
    } else {
      await fetch(`/api/admin/activity/stat/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify(vals),
      });
    }
    setEditing(null); fetchData(tok);
  };

  const deleteStat = async (id) => {
    if (!confirm("Delete this stat?")) return;
    await fetch(`/api/admin/activity/stat/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${t()}` } });
    fetchData(t());
  };

  const saveLang = async (vals) => {
    const tok = t();
    if (editing.id === "new") {
      await fetch("/api/admin/activity", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ type: "language", ...vals }),
      });
    } else {
      await fetch(`/api/admin/activity/language/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify(vals),
      });
    }
    setEditing(null); fetchData(tok);
  };

  const deleteLang = async (id) => {
    if (!confirm("Delete this language?")) return;
    await fetch(`/api/admin/activity/language/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${t()}` } });
    fetchData(t());
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-4">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">Activity</h1>
            <p className="text-[#888888] text-sm mt-1">{data.stats.length} stats · {data.languages.length} languages</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
        ) : (
          <div className="space-y-16">
            {/* Stats */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-[family-name:var(--font-heading)] text-white">Stat Cards</h2>
                <button onClick={() => setEditing({ type: "stat", id: "new", values: { label: "", value: "", icon_name: "GitCommit", sort_order: data.stats.length } })} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                  <Plus size={14} /> Add Stat
                </button>
              </div>

              {editing?.type === "stat" && editing.id === "new" && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <StatForm values={editing.values} onSave={saveStat} onCancel={() => setEditing(null)} />
                </div>
              )}

              <div className="space-y-2">
                {data.stats.map((stat) => (
                  <motion.div key={stat.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ef745c]/20 to-[#34073d]/20 flex items-center justify-center shrink-0">
                      <GitCommit className="text-[#ef745c]" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-medium">{stat.label}</span>
                        <span className="text-[#ef745c] text-sm font-mono">{stat.value}</span>
                        <span className="text-[10px] text-[#555555]">#{stat.sort_order}</span>
                      </div>
                      <p className="text-xs text-[#555555]">Icon: {stat.icon_name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditing({ type: "stat", id: stat.id, values: { label: stat.label, value: stat.value, icon_name: stat.icon_name, sort_order: stat.sort_order } })} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04]"><Edit3 size={14} /></button>
                      <button onClick={() => deleteStat(stat.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04]"><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {editing?.type === "stat" && editing.id !== "new" && (
                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <StatForm values={editing.values} onSave={saveStat} onCancel={() => setEditing(null)} />
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-[family-name:var(--font-heading)] text-white">Languages</h2>
                <button onClick={() => setEditing({ type: "language", id: "new", values: { name: "", percentage: 50, color: "#f7df1e", sort_order: data.languages.length } })} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                  <Plus size={14} /> Add Language
                </button>
              </div>

              {editing?.type === "language" && editing.id === "new" && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <LangForm values={editing.values} onSave={saveLang} onCancel={() => setEditing(null)} />
                </div>
              )}

              <div className="space-y-2">
                {data.languages.map((lang, i) => (
                  <motion.div key={lang.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${lang.color}20` }}>
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: lang.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{lang.name}</span>
                        <span className="text-[#ef745c] text-sm font-mono">{lang.percentage}%</span>
                        <span className="text-[10px] text-[#555555]">#{lang.sort_order}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full max-w-[300px]">
                        <div className="h-full rounded-full" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditing({ type: "language", id: lang.id, values: { name: lang.name, percentage: lang.percentage, color: lang.color, sort_order: lang.sort_order } })} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04]"><Edit3 size={14} /></button>
                      <button onClick={() => deleteLang(lang.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04]"><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {editing?.type === "language" && editing.id !== "new" && (
                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <LangForm values={editing.values} onSave={saveLang} onCancel={() => setEditing(null)} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatForm({ values, onSave, onCancel }) {
  const [label, setLabel] = useState(values.label || "");
  const [value, setValue] = useState(values.value || "");
  const [icon, setIcon] = useState(values.icon_name || "GitCommit");
  const [order, setOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Label</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-24">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Value</label>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-28">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Icon</label>
        <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none">
          {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="w-16">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Order</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ label: label.trim(), value: value.trim(), icon_name: icon, sort_order: order })} className="px-4 py-2 rounded-lg bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80"><Save size={14} /></button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-[#555555] text-xs hover:text-white"><X size={14} /></button>
      </div>
    </div>
  );
}

function LangForm({ values, onSave, onCancel }) {
  const [name, setName] = useState(values.name || "");
  const [percentage, setPercentage] = useState(values.percentage ?? 50);
  const [color, setColor] = useState(values.color || "#f7df1e");
  const [order, setOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[140px]">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-20">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">%</label>
        <input type="number" min="0" max="100" value={percentage} onChange={(e) => setPercentage(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-20">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-[38px] px-1 rounded-lg bg-white/[0.03] border border-white/[0.08] cursor-pointer" />
      </div>
      <div className="w-16">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase">Order</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ name: name.trim(), percentage, color, sort_order: order })} className="px-4 py-2 rounded-lg bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80"><Save size={14} /></button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-[#555555] text-xs hover:text-white"><X size={14} /></button>
      </div>
    </div>
  );
}
