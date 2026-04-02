"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  blog: {
    _id: string;
    title: string;
    slug: string;
  } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchComments = async () => {
    try {
      const res = await api.get("/comments/admin/all");
      setComments(res.data);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/comments/${id}/approve`);
      fetchComments();
    } catch {
      alert("Failed to approve");
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/comments/${deleteId}`);
      fetchComments();
    } catch {
      alert("Failed to delete");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const commentToDelete = comments.find((c) => c._id === deleteId);

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.isApproved;
    if (filter === "approved") return c.isApproved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.isApproved).length;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#171200", marginBottom: 6 }}>
            Comments
            {pendingCount > 0 && (
              <span style={{
                marginLeft: 12,
                fontSize: 13,
                backgroundColor: "#E02222",
                color: "#fff",
                padding: "5px 14px",
                borderRadius: 50,
                fontWeight: 600,
                verticalAlign: "middle",
              }}>
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p style={{ fontSize: 15, color: "#888" }}>{comments.length} total comments</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "12px 22px",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: filter === f ? "#E02222" : "#fff",
                color: filter === f ? "#fff" : "#666",
                boxShadow: filter === f ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#888" }}>No {filter !== "all" ? filter : ""} comments found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filtered.map((comment) => (
            <div
              key={comment._id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                border: "1px solid #eee",
                borderLeft: comment.isApproved ? "4px solid #4CAF50" : "4px solid #E02222",
                padding: "28px 28px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div>
                {/* Header row: Avatar + Name + Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: comment.isApproved ? "#4CAF50" : "#E02222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, color: "#171200", fontSize: 15 }}>{comment.name}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "4px 12px",
                        borderRadius: 50,
                        backgroundColor: comment.isApproved ? "rgba(76,175,80,0.1)" : "rgba(224,34,34,0.1)",
                        color: comment.isApproved ? "#4CAF50" : "#E02222",
                      }}>
                        {comment.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{comment.email}</p>
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingLeft: 58 }}>
                  {comment.blog && (
                    <p style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
                      On: <span style={{ fontWeight: 600, color: "#555" }}>{comment.blog.title}</span>
                    </p>
                  )}
                  <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7 }}>
                    {comment.content}
                  </p>
                  <p style={{ fontSize: 12, color: "#aaa", marginTop: 10 }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>

                  {/* Action Buttons - below content */}
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  {!comment.isApproved && (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "10px 20px",
                        backgroundColor: "rgba(76,175,80,0.1)",
                        color: "#4CAF50",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(76,175,80,0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(76,175,80,0.1)")}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(comment._id)}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "10px 20px",
                      backgroundColor: "rgba(224,34,34,0.1)",
                      color: "#E02222",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,34,34,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,34,34,0.1)")}
                  >
                    Delete
                  </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Modal */}
      {deleteId && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(224,34,34,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E02222" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#171200", marginBottom: 8 }}>Delete Comment</h3>
            {commentToDelete && (
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 8 }}>
                Comment by <strong style={{ color: "#171200" }}>{commentToDelete.name}</strong>
              </p>
            )}
            {commentToDelete && (
              <p style={{ fontSize: 13, color: "#555", fontStyle: "italic", marginBottom: 28, padding: "0 20px" }}>
                &ldquo;{commentToDelete.content.length > 80 ? commentToDelete.content.slice(0, 80) + "..." : commentToDelete.content}&rdquo;
              </p>
            )}
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, backgroundColor: "#f3f4f6", color: "#555", border: "none", borderRadius: 12, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: 14, fontSize: 14, fontWeight: 600, backgroundColor: "#E02222", color: "#fff", border: "none", borderRadius: 12, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {deleting && <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
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
