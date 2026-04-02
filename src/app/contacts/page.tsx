"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data);
    } catch {
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/contacts/${id}/read`);
      fetchContacts();
    } catch {
      // silently fail
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/contacts/${deleteId}`);
      if (selected?._id === deleteId) setSelected(null);
      fetchContacts();
    } catch {
      alert("Failed to delete");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const contactToDelete = contacts.find((c) => c._id === deleteId);

  const handleSelect = (contact: Contact) => {
    setSelected(contact);
    if (!contact.isRead) handleMarkRead(contact._id);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#171200", marginBottom: 6 }}>Contact Submissions</h1>
        <p style={{ fontSize: 15, color: "#888" }}>{contacts.length} submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* List */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #eee", backgroundColor: "#fafafa" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#171200" }}>
              {contacts.filter(c => !c.isRead).length} unread
            </p>
          </div>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {contacts.map((contact) => (
              <button
                key={contact._id}
                onClick={() => handleSelect(contact)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "20px 24px",
                  borderBottom: "1px solid #f5f5f5",
                  cursor: "pointer",
                  background: selected?._id === contact._id ? "#f8f8f8" : "transparent",
                  border: "none",
                  borderLeft: selected?._id === contact._id ? "3px solid #E02222" : "3px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {!contact.isRead && (
                    <span style={{ width: 8, height: 8, backgroundColor: "#E02222", borderRadius: "50%", flexShrink: 0 }} />
                  )}
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#171200" }}>
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
                <p style={{ fontSize: 13, color: "#888", marginTop: 4, paddingLeft: contact.isRead ? 0 : 18 }}>
                  {contact.email}
                </p>
                <p style={{ fontSize: 12, color: "#bbb", marginTop: 4, paddingLeft: contact.isRead ? 0 : 18 }}>
                  {new Date(contact.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </button>
            ))}
            {contacts.length === 0 && (
              <p style={{ padding: "40px 24px", fontSize: 15, color: "#888", textAlign: "center" }}>
                No submissions yet
              </p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "36px 32px" }}>
          {selected ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "#E02222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 700,
                  }}>
                    {selected.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#171200" }}>
                      {selected.firstName} {selected.lastName}
                    </h2>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(selected._id)}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "10px 20px",
                    backgroundColor: "rgba(224,34,34,0.1)",
                    color: "#E02222",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div style={{ backgroundColor: "#fafafa", borderRadius: 12, padding: "20px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Email</p>
                    <a href={`mailto:${selected.email}`} style={{ fontSize: 15, color: "#E02222", textDecoration: "none", wordBreak: "break-all" }}>
                      {selected.email}
                    </a>
                  </div>
                  <div style={{ backgroundColor: "#fafafa", borderRadius: 12, padding: "20px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Phone</p>
                    <p style={{ fontSize: 15, color: "#333" }}>{selected.phone || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Message</p>
                  <div style={{ fontSize: 15, color: "#333", lineHeight: 1.8, backgroundColor: "#fafafa", borderRadius: 12, padding: "24px 28px" }}>
                    {selected.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300 }}>
              <p style={{ fontSize: 16, color: "#bbb" }}>Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>

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
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#171200", marginBottom: 8 }}>Delete Contact</h3>
            {contactToDelete && (
              <p style={{ fontSize: 15, fontWeight: 600, color: "#171200", marginBottom: 8 }}>
                {contactToDelete.firstName} {contactToDelete.lastName}
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
