"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ImageUploader from "./ImageUploader";

interface BlogFormProps {
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    isPublished: boolean;
  };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?._id;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "General",
    tags: initialData?.tags || [],
    isPublished: initialData?.isPublished || false,
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/blogs/${initialData._id}`, form);
      } else {
        await api.post("/blogs", form);
      }
      router.push("/blogs");
    } catch {
      alert("Failed to save blog");
    }
    setSaving(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: "16px 20px",
    fontSize: 15,
    color: "#171200",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#555",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #eee", padding: "40px 36px", maxWidth: 900 }}>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Enter blog title..."
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "#E02222"; e.target.style.boxShadow = "0 0 0 3px rgba(224,34,34,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Cover Image */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Cover Image</label>
          {form.coverImage && (
            <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", display: "inline-block" }}>
              <img src={form.coverImage} alt="" style={{ width: 280, height: 180, objectFit: "cover", display: "block" }} />
            </div>
          )}
          <ImageUploader
            onUploaded={(url) => setForm({ ...form, coverImage: url })}
          />
        </div>

        {/* Category + Publish */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Design, Technology"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#E02222"; e.target.style.boxShadow = "0 0 0 3px rgba(224,34,34,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: form.isPublished ? "none" : "2px solid #ccc",
                backgroundColor: form.isPublished ? "#E02222" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
                onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              >
                {form.isPublished && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                style={{ display: "none" }}
              />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#171200" }}>
                Publish immediately
              </span>
            </label>
          </div>
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
            placeholder="Short description (auto-generated from content if empty)"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={(e) => { e.target.style.borderColor = "#E02222"; e.target.style.boxShadow = "0 0 0 3px rgba(224,34,34,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Content (HTML supported)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={20}
            placeholder="Write your blog content here. HTML tags are supported for formatting."
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, resize: "vertical" }}
            onFocus={(e) => { e.target.style.borderColor = "#E02222"; e.target.style.boxShadow = "0 0 0 3px rgba(224,34,34,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 36 }}>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              onFocus={(e) => { e.target.style.borderColor = "#E02222"; e.target.style.boxShadow = "0 0 0 3px rgba(224,34,34,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={addTag}
              style={{
                backgroundColor: "#171200",
                color: "#fff",
                padding: "14px 24px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#171200")}
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {form.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#f3f3f3",
                    color: "#555",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "8px 16px",
                    borderRadius: 50,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#E02222",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: "#E02222",
            color: "#fff",
            padding: "16px 40px",
            fontSize: 15,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            borderRadius: 12,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#c41e1e"; }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E02222")}
        >
          {saving && (
            <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          )}
          {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}
