"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, ArrowLeft, GripVertical, Save, X, ChevronDown, ChevronRight } from "lucide-react";

const ICON_OPTIONS = ["Code2", "Layout", "Terminal", "Database", "Wrench", "Server", "Smartphone", "Globe", "Cloud", "GitBranch", "Braces", "Cpu"];

export default function AdminSkills() {
  const [data, setData] = useState({ categories: [], techTags: [] });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [editing, setEditing] = useState({}); // { type: 'category'|'skill'|'tech_tag', id: 'new'|uuid, values: {} }
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    setAuthenticated(true);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await fetch("/api/admin/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); router.push("/admin"); return; }
      const d = await res.json();
      setData(d);
    } catch {} finally { setLoading(false); }
  };

  const token = () => localStorage.getItem("admin_token");

  const api = async (url, opts) => {
    const res = await fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", ...opts?.headers, Authorization: `Bearer ${token()}` },
    });
    if (res.ok) fetchData(token());
    return res;
  };

  // --- Category ---
  const saveCategory = async (vals) => {
    if (editing.id === "new") {
      await api("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify({ type: "category", ...vals }),
      });
    } else {
      await api(`/api/admin/skills/category/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(vals),
      });
    }
    setEditing({});
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category and all its skills?")) return;
    await api(`/api/admin/skills/category/${id}`, { method: "DELETE" });
  };

  // --- Skill ---
  const saveSkill = async (vals) => {
    if (editing.id === "new") {
      await api("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify({ type: "skill", ...vals }),
      });
    } else {
      await api(`/api/admin/skills/skill/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(vals),
      });
    }
    setEditing({});
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;
    await api(`/api/admin/skills/skill/${id}`, { method: "DELETE" });
  };

  // --- Tech Tag ---
  const saveTechTag = async (vals) => {
    if (editing.id === "new") {
      await api("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify({ type: "tech_tag", ...vals }),
      });
    } else {
      await api(`/api/admin/skills/tech-tag/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(vals),
      });
    }
    setEditing({});
  };

  const deleteTechTag = async (id) => {
    if (!confirm("Delete this tech tag?")) return;
    await api(`/api/admin/skills/tech-tag/${id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">Skills</h1>
            <p className="text-[#888888] text-sm mt-1">{data.categories.length} categories · {data.techTags.length} tech tags</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
        ) : (
          <div className="space-y-16">
            {/* Categories & Skills */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-[family-name:var(--font-heading)] text-white">Skill Categories</h2>
                <button onClick={() => setEditing({ type: "category", id: "new", values: { name: "", icon_name: "Code2", sort_order: 0 } })} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {editing.type === "category" && editing.id === "new" && (
                <CategoryForm values={editing.values} onSave={saveCategory} onCancel={() => setEditing({})} />
              )}

              <div className="space-y-3">
                {data.categories.map((cat) => (
                  <motion.div key={cat.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <div className="flex items-center gap-3 p-4">
                      <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)} className="text-[#555555] hover:text-white transition-colors">
                        {expandedCat === cat.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{cat.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#555555]">{cat.icon_name}</span>
                          <span className="text-[10px] text-[#555555]">#{cat.sort_order}</span>
                        </div>
                        <p className="text-xs text-[#555555]">{(cat.skills || []).length} skills</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setEditing({ type: "category", id: cat.id, values: { name: cat.name, icon_name: cat.icon_name, sort_order: cat.sort_order } })} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {editing.type === "category" && editing.id === cat.id && (
                      <div className="px-4 pb-4 border-t border-white/[0.04] pt-4">
                        <CategoryForm values={editing.values} onSave={saveCategory} onCancel={() => setEditing({})} />
                      </div>
                    )}

                    {expandedCat === cat.id && (
                      <div className="border-t border-white/[0.04] px-4 py-4 space-y-2">
                        {(cat.skills || []).map((skill) => (
                          <div key={skill.id} className="flex items-center gap-3 pl-4">
                            <div className="min-w-0 flex-1 flex items-center gap-3">
                              <span className="text-white text-sm">{skill.name}</span>
                              <div className="flex-1 max-w-[200px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-[#ef745c] rounded-full" style={{ width: `${skill.level}%` }} />
                              </div>
                              <span className="text-[#ef745c] text-xs font-mono">{skill.level}%</span>
                              <span className="text-[10px] text-[#555555]">#{skill.sort_order}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => setEditing({ type: "skill", id: skill.id, values: { name: skill.name, level: skill.level, category_id: skill.category_id, sort_order: skill.sort_order } })} className="p-1.5 rounded-lg text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                                <Edit3 size={12} />
                              </button>
                              <button onClick={() => deleteSkill(skill.id)} className="p-1.5 rounded-lg text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => setEditing({ type: "skill", id: "new", values: { name: "", level: 50, category_id: cat.id, sort_order: (cat.skills || []).length } })} className="flex items-center gap-1 text-xs text-[#555555] hover:text-white transition-colors pl-4 pt-2">
                          <Plus size={12} /> Add skill
                        </button>

                        {editing.type === "skill" && editing.id === "new" && editing.values.category_id === cat.id && (
                          <div className="pl-4 pt-3 border-t border-white/[0.04]">
                            <SkillForm values={editing.values} onSave={saveSkill} onCancel={() => setEditing({})} />
                          </div>
                        )}
                        {editing.type === "skill" && editing.id !== "new" && cat.skills.find(s => s.id === editing.id) && (
                          <div className="pl-4 pt-3 border-t border-white/[0.04]">
                            <SkillForm values={editing.values} onSave={saveSkill} onCancel={() => setEditing({})} />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-[family-name:var(--font-heading)] text-white">Tech Tags</h2>
                <button onClick={() => setEditing({ type: "tech_tag", id: "new", values: { name: "", sort_order: data.techTags.length } })} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                  <Plus size={14} /> Add Tag
                </button>
              </div>

              {editing.type === "tech_tag" && editing.id === "new" && (
                <div className="mb-4">
                  <TechTagForm values={editing.values} onSave={saveTechTag} onCancel={() => setEditing({})} />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {data.techTags.map((tag) => (
                  <div key={tag.id} className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-[#888888] hover:text-white hover:border-white/[0.12] transition-all">
                    <span>{tag.name}</span>
                    <span className="text-[10px] text-[#555555]">#{tag.sort_order}</span>
                    <button onClick={() => setEditing({ type: "tech_tag", id: tag.id, values: { name: tag.name, sort_order: tag.sort_order } })} className="p-1 rounded-lg text-[#555555] hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => deleteTechTag(tag.id)} className="p-1 rounded-lg text-[#555555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {editing.type === "tech_tag" && editing.id !== "new" && (
                <div className="mt-4">
                  <TechTagForm values={editing.values} onSave={saveTechTag} onCancel={() => setEditing({})} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryForm({ values, onSave, onCancel }) {
  const [name, setName] = useState(values.name || "");
  const [icon, setIcon] = useState(values.icon_name || "Code2");
  const [order, setOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-32">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Icon</label>
        <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none">
          {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="w-20">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Order</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ name, icon_name: icon, sort_order: order })} className="px-4 py-2 rounded-lg bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80 transition-all"><Save size={14} /></button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-[#555555] text-xs hover:text-white transition-all"><X size={14} /></button>
      </div>
    </div>
  );
}

function SkillForm({ values, onSave, onCancel }) {
  const [name, setName] = useState(values.name || "");
  const [level, setLevel] = useState(values.level ?? 50);
  const [order, setOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-24">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Level %</label>
        <input type="number" min="0" max="100" value={level} onChange={(e) => setLevel(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-20">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Order</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ name, level, category_id: values.category_id, sort_order: order })} className="px-4 py-2 rounded-lg bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80 transition-all"><Save size={14} /></button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-[#555555] text-xs hover:text-white transition-all"><X size={14} /></button>
      </div>
    </div>
  );
}

function TechTagForm({ values, onSave, onCancel }) {
  const [name, setName] = useState(values.name || "");
  const [order, setOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="w-20">
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Order</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ name, sort_order: order })} className="px-4 py-2 rounded-lg bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80 transition-all"><Save size={14} /></button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-[#555555] text-xs hover:text-white transition-all"><X size={14} /></button>
      </div>
    </div>
  );
}
