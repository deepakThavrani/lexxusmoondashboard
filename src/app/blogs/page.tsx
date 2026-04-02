"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface Blog {
  _id: string;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
  likes: number;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs/admin/all");
      setBlogs(res.data);
    } catch {
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/blogs/${deleteId}`);
      fetchBlogs();
    } catch {
      alert("Failed to delete blog");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const blogToDelete = blogs.find((b) => b._id === deleteId);

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#171200", marginBottom: 6 }}>Blog Posts</h1>
          <p style={{ fontSize: 15, color: "#888" }}>{blogs.length} total posts</p>
        </div>
        <Link
          href="/blogs/new"
          style={{
            backgroundColor: "#E02222",
            color: "#fff",
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c41e1e")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E02222")}
        >
          + New Post
        </Link>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#fafafa", borderBottom: "2px solid #eee" }}>
              <th style={{ textAlign: "left", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</th>
              <th style={{ textAlign: "left", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</th>
              <th style={{ textAlign: "left", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
              <th style={{ textAlign: "center", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Views</th>
              <th style={{ textAlign: "center", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Likes</th>
              <th style={{ textAlign: "left", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
              <th style={{ textAlign: "left", padding: "18px 24px", fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} style={{ borderBottom: "1px solid #f3f3f3", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "20px 24px", fontSize: 15, fontWeight: 600, color: "#171200" }}>{blog.title}</td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#666" }}>{blog.category}</td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 50,
                    backgroundColor: blog.isPublished ? "rgba(76,175,80,0.1)" : "rgba(255,152,0,0.1)",
                    color: blog.isPublished ? "#4CAF50" : "#FF9800",
                  }}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#2196F3" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {blog.views || 0}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#E02222" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {blog.likes || 0}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#888" }}>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Link
                      href={`/blogs/edit/${blog._id}`}
                      style={{ fontSize: 14, fontWeight: 600, color: "#2196F3", textDecoration: "none" }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(blog._id)}
                      style={{ fontSize: 14, fontWeight: 600, color: "#E02222", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "60px 24px", textAlign: "center", fontSize: 15, color: "#888" }}>
                  No blog posts yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: "36px 32px",
              maxWidth: 420,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
            }}
          >
            {/* Warning Icon */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "rgba(224,34,34,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E02222" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#171200", marginBottom: 8 }}>
              Delete Blog Post
            </h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 8 }}>
              Are you sure you want to delete
            </p>
            {blogToDelete && (
              <p style={{ fontSize: 15, fontWeight: 600, color: "#171200", marginBottom: 28 }}>
                &ldquo;{blogToDelete.title}&rdquo;
              </p>
            )}
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28 }}>
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#555",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor: "#E02222",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.6 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.backgroundColor = "#c41e1e"; }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E02222")}
              >
                {deleting && (
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </AdminLayout>
  );
}
