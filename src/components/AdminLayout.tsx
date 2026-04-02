"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Blogs", href: "/blogs", icon: "📝" },
  { label: "Comments", href: "/comments", icon: "💬" },
  { label: "Contacts", href: "/contacts", icon: "📩" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) { router.push("/login"); return; }
      try {
        await api.get("/auth/verify");
        setVerified(true);
      } catch {
        localStorage.removeItem("admin_token");
        router.push("/login");
      }
    };
    verifyToken();
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  if (!verified) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E02222", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Lexxusmoon</h2>
          <p style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Admin Panel</p>
        </div>
        {!isDesktop && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
      <nav style={{ flex: 1, paddingTop: 12, paddingBottom: 12 }}>
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#E02222" : "#888",
                backgroundColor: isActive ? "rgba(224,34,34,0.08)" : "transparent",
                borderLeft: isActive ? "3px solid #E02222" : "3px solid transparent",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid #222" }}>
        <button
          onClick={handleLogout}
          style={{ width: "100%", textAlign: "left", fontSize: 14, color: "#666", background: "none", border: "none", cursor: "pointer", padding: "10px 0" }}
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", display: "flex" }}>
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside style={{
          width: 220,
          minWidth: 220,
          backgroundColor: "#0f0f0f",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Backdrop */}
      {!isDesktop && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 40 }}
        />
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <aside style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 260,
          backgroundColor: "#0f0f0f",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "transform 0.3s",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: "100vh", minWidth: 0 }}>
        {/* Mobile Top Bar */}
        {!isDesktop && (
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <button onClick={() => setSidebarOpen(true)} style={{ padding: 8, background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171200" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#171200" }}>Lexxusmoon</span>
            <div style={{ width: 32 }} />
          </div>
        )}

        <div style={{ padding: isDesktop ? 40 : 16 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
