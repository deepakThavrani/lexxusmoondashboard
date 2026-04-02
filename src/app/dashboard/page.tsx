"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface Blog {
  _id: string;
  title: string;
  views: number;
  likes: number;
  category: string;
  createdAt: string;
  isPublished: boolean;
}

interface Comment {
  _id: string;
  name: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  blog: { title: string } | null;
}

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  isRead: boolean;
  createdAt: string;
}

// Bar with hover tooltip
function Bar({ value, max, color, label, extra }: { value: number; max: number; color: string; label: string; extra?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ marginBottom: 20, position: "relative", cursor: "pointer", padding: "10px 14px", backgroundColor: hovered ? "#f8f9fa" : "transparent", borderRadius: 10, transition: "background 0.2s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6, alignItems: "baseline" }}>
        <span style={{ fontSize: 11, color: hovered ? "#171200" : "#555", fontWeight: hovered ? 600 : 500, transition: "all 0.2s", flex: 1, minWidth: 0, lineHeight: 1.4 }}>{label}</span>
        <span style={{ fontSize: 12, color: hovered ? color : "#888", fontWeight: 600, transition: "all 0.2s", flexShrink: 0 }}>{value}</span>
      </div>
      <div style={{ height: 12, backgroundColor: "#f0f0f0", borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          width: `${Math.max(pct, 3)}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: 6,
          transition: "width 1s ease, opacity 0.2s",
          opacity: hovered ? 1 : 0.75,
        }} />
      </div>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: "absolute",
          top: -44,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#171200",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
          zIndex: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {value} views {extra ? `• ${extra}` : ""}
          <div style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            backgroundColor: "#171200",
            rotate: "45deg",
          }} />
        </div>
      )}
    </div>
  );
}

// Donut chart with hover
function Donut({ segments, size = 180 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 70;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {total === 0 ? (
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
        ) : (
          segments.map((seg, i) => {
            const pct = seg.value / total;
            const dashLength = circumference * pct;
            const dashOffset = -offset;
            offset += dashLength;
            const isHovered = hoveredIdx === i;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 8 : strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: "all 0.3s ease", cursor: "pointer", opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })
        )}
        {/* Center text changes on hover */}
        <text x="100" y="90" textAnchor="middle" style={{ fontSize: 32, fontWeight: 800, fill: "#171200" }}>
          {hoveredIdx !== null ? segments[hoveredIdx].value : total}
        </text>
        <text x="100" y="115" textAnchor="middle" style={{ fontSize: 12, fill: "#888", fontWeight: 500 }}>
          {hoveredIdx !== null ? segments[hoveredIdx].label : "Total"}
        </text>
        {hoveredIdx !== null && (
          <text x="100" y="132" textAnchor="middle" style={{ fontSize: 11, fill: "#aaa" }}>
            {total > 0 ? Math.round((segments[hoveredIdx].value / total) * 100) : 0}%
          </text>
        )}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1,
              transition: "opacity 0.2s",
              padding: "4px 8px",
              borderRadius: 6,
              backgroundColor: hoveredIdx === i ? `${seg.color}15` : "transparent",
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: seg.color }} />
            <span style={{ fontSize: 12, color: hoveredIdx === i ? "#171200" : "#666", fontWeight: hoveredIdx === i ? 600 : 400 }}>
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Area chart with gradient, vertical bars, hover tooltips
function AreaChart({ data, color, labels, unit }: { data: number[]; color: string; labels: string[]; unit: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const total = data.reduce((s, v) => s + v, 0);
  const h = 180;
  const w = 400;
  const padX = 40;
  const padTop = 20;
  const padBot = 40;
  const chartH = h - padTop - padBot;
  const chartW = w - padX * 2;
  const step = chartW / (data.length - 1);
  const barW = step * 0.5;
  const getX = (i: number) => padX + i * step;
  const getY = (v: number) => padTop + chartH - (v / max) * chartH;
  const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
  const gradientId = `grad-${color.replace("#", "")}`;

  // Smooth path using quadratic bezier
  const pathD = data.map((v, i) => {
    const x = getX(i);
    const y = getY(v);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(data[i - 1]);
    const cpX = (prevX + x) / 2;
    return `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
  }).join(" ");

  const areaD = `${pathD} L ${getX(data.length - 1)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`;

  return (
    <div style={{ position: "relative" }}>
      {/* Summary */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: "#171200" }}>{total}</span>
        <span style={{ fontSize: 13, color: "#888" }}>total {unit}</span>
      </div>

      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Y-axis grid + labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padTop + chartH - pct * chartH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="#f0f0f0" strokeWidth={1} />
              <text x={padX - 8} y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: "#ccc" }}>
                {Math.round(max * pct)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />

        {/* Bar columns + dots + hover */}
        {data.map((v, i) => {
          const x = getX(i);
          const y = getY(v);
          const isHovered = hoveredIdx === i;
          return (
            <g key={i}>
              {/* Invisible hover area */}
              <rect
                x={x - step / 2}
                y={0}
                width={step}
                height={h}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              />
              {/* Vertical bar on hover */}
              {isHovered && (
                <>
                  <rect x={x - barW / 2} y={y} width={barW} height={padTop + chartH - y} rx={4} fill={color} opacity={0.12} />
                  <line x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke={color} strokeWidth={1} opacity={0.15} />
                </>
              )}
              {/* Dot */}
              <circle cx={x} cy={y} r={isHovered ? 7 : 4} fill={isHovered ? color : "#fff"} stroke={color} strokeWidth={isHovered ? 3 : 2.5} style={{ transition: "all 0.2s" }} />
              {/* Glow on hover */}
              {isHovered && (
                <circle cx={x} cy={y} r={14} fill={color} opacity={0.1} />
              )}

              {/* X-axis label */}
              <text x={x} y={h - 10} textAnchor="middle" style={{
                fontSize: 11,
                fill: isHovered ? "#171200" : "#bbb",
                fontWeight: isHovered ? 700 : 400,
                transition: "all 0.2s",
              }}>
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && (
        <div style={{
          position: "absolute",
          top: 20,
          left: `${(getX(hoveredIdx) / w) * 100}%`,
          transform: "translateX(-50%) translateY(-100%)",
          backgroundColor: "#171200",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: "nowrap",
          zIndex: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>{data[hoveredIdx]}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{labels[hoveredIdx]} • {unit}</span>
          <div style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            backgroundColor: "#171200",
            rotate: "45deg",
          }} />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    contacts: 0,
    unreadContacts: 0,
    comments: 0,
    pendingComments: 0,
    approvedComments: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });
  const [topBlogs, setTopBlogs] = useState<Blog[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [blogsByDay, setBlogsByDay] = useState<number[]>([]);
  const [contactsByDay, setContactsByDay] = useState<number[]>([]);
  const [categoryData, setCategoryData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogsRes, contactsRes, commentsRes] = await Promise.all([
          api.get("/blogs/admin/all"),
          api.get("/contacts"),
          api.get("/comments/admin/all"),
        ]);

        const blogs: Blog[] = blogsRes.data;
        const contacts: Contact[] = contactsRes.data;
        const comments: Comment[] = commentsRes.data;

        const unread = contacts.filter((c) => !c.isRead).length;
        const pending = comments.filter((c) => !c.isApproved).length;
        const approved = comments.filter((c) => c.isApproved).length;
        const published = blogs.filter((b) => b.isPublished).length;
        const draft = blogs.filter((b) => !b.isPublished).length;

        setStats({
          blogs: blogs.length,
          contacts: contacts.length,
          unreadContacts: unread,
          comments: comments.length,
          pendingComments: pending,
          approvedComments: approved,
          publishedBlogs: published,
          draftBlogs: draft,
        });

        // Top blogs by views
        const sorted = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
        setTopBlogs(sorted.slice(0, 5));

        // Recent comments
        setRecentComments(comments.slice(0, 5));

        // Recent contacts
        setRecentContacts(contacts.slice(0, 5));

        // Blogs per day (last 7 days)
        const now = new Date();
        const days7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - i));
          return d.toDateString();
        });
        setDayLabels(days7.map((day) => new Date(day).toLocaleDateString("en-US", { weekday: "short" })));
        setBlogsByDay(days7.map((day) => blogs.filter((b) => new Date(b.createdAt).toDateString() === day).length));
        setContactsByDay(days7.map((day) => contacts.filter((c) => new Date(c.createdAt).toDateString() === day).length));

        // Categories
        const catMap: Record<string, number> = {};
        blogs.forEach((b) => {
          catMap[b.category] = (catMap[b.category] || 0) + 1;
        });
        const colors = ["#E02222", "#2196F3", "#FF9800", "#4CAF50", "#9C27B0", "#00BCD4"];
        setCategoryData(
          Object.entries(catMap).map(([label, value], i) => ({
            label,
            value,
            color: colors[i % colors.length],
          }))
        );
      } catch {
        // silently fail
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Blog Posts", value: stats.blogs, color: "#2196F3", bg: "rgba(33,150,243,0.08)", icon: "📝" },
    { label: "Total Comments", value: stats.comments, color: "#9C27B0", bg: "rgba(156,39,176,0.08)", icon: "💬" },
    { label: "Pending Comments", value: stats.pendingComments, color: "#E02222", bg: "rgba(224,34,34,0.08)", icon: "⏳" },
    { label: "Total Contacts", value: stats.contacts, color: "#FF9800", bg: "rgba(255,152,0,0.08)", icon: "📩" },
    { label: "Unread Messages", value: stats.unreadContacts, color: "#E02222", bg: "rgba(224,34,34,0.06)", icon: "🔴" },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 40 }}>
        <h1 className="text-xl md:text-2xl lg:text-[28px]" style={{ fontWeight: 800, color: "#171200", marginBottom: 6 }}>Dashboard</h1>
        <p style={{ fontSize: 15, color: "#888" }}>Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5" style={{ marginBottom: 40 }}>
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-4 md:p-6 lg:p-[28px_24px]"
            style={{
              backgroundColor: card.bg,
              borderRadius: 16,
              border: `1px solid ${card.color}15`,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: card.color }} />
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: card.color, marginBottom: 4 }}>{card.value}</p>
            <p style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginBottom: 40, alignItems: "stretch" }}>
        {/* Blog Views Chart */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 6 }}>Top Blog Posts</h3>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>By views</p>
          {topBlogs.length > 0 ? (
            topBlogs.map((blog) => (
              <Bar
                key={blog._id}
                value={blog.views || 0}
                max={Math.max(...topBlogs.map((b) => b.views || 0), 1)}
                color="#2196F3"
                label={blog.title}
                extra={`${blog.likes || 0} likes`}
              />
            ))
          ) : (
            <p style={{ fontSize: 14, color: "#ccc", textAlign: "center", padding: "40px 0" }}>No data yet</p>
          )}
        </div>

        {/* Comments Donut */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 6, alignSelf: "flex-start", width: "100%" }}>Comments Overview</h3>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24, alignSelf: "flex-start" }}>Approved vs Pending</p>
          <Donut segments={[
            { value: stats.approvedComments, color: "#4CAF50", label: "Approved" },
            { value: stats.pendingComments, color: "#E02222", label: "Pending" },
          ]} />
        </div>

        {/* Blog Categories Donut */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 6, alignSelf: "flex-start", width: "100%" }}>Blog Categories</h3>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24, alignSelf: "flex-start" }}>Distribution</p>
          <Donut segments={categoryData} />
        </div>
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: 40 }}>
        {/* Blog Activity */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 4 }}>Blog Activity</h3>
              <p style={{ fontSize: 12, color: "#aaa" }}>Last 7 days</p>
            </div>
            <div style={{
              backgroundColor: stats.publishedBlogs > 0 ? "rgba(76,175,80,0.1)" : "#f5f5f5",
              padding: "6px 14px",
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 600,
              color: "#4CAF50",
            }}>
              {stats.publishedBlogs} published / {stats.draftBlogs} draft
            </div>
          </div>
          <AreaChart data={blogsByDay} color="#2196F3" labels={dayLabels} unit="posts" />
        </div>

        {/* Contact Activity */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 4 }}>Contact Activity</h3>
              <p style={{ fontSize: 12, color: "#aaa" }}>Last 7 days</p>
            </div>
            <div style={{
              backgroundColor: stats.unreadContacts > 0 ? "rgba(224,34,34,0.1)" : "#f5f5f5",
              padding: "6px 14px",
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 600,
              color: stats.unreadContacts > 0 ? "#E02222" : "#888",
            }}>
              {stats.unreadContacts} unread
            </div>
          </div>
          <AreaChart data={contactsByDay} color="#FF9800" labels={dayLabels} unit="contacts" />
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 20 }}>Recent Comments</h3>
          {recentComments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recentComments.map((c) => (
                <div key={c._id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 16px", backgroundColor: "#fafafa", borderRadius: 12 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: c.isApproved ? "#4CAF50" : "#E02222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#171200" }}>{c.name}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 50,
                        backgroundColor: c.isApproved ? "rgba(76,175,80,0.1)" : "rgba(224,34,34,0.1)",
                        color: c.isApproved ? "#4CAF50" : "#E02222",
                      }}>
                        {c.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.content}
                    </p>
                    {c.blog && (
                      <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>on {c.blog.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "#ccc", textAlign: "center", padding: "30px 0" }}>No comments yet</p>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="p-4 md:p-7" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #eee" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171200", marginBottom: 20 }}>Recent Contacts</h3>
          {recentContacts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recentContacts.map((c) => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", backgroundColor: "#fafafa", borderRadius: 12 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: c.isRead ? "#ddd" : "#E02222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {c.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#171200" }}>
                      {c.firstName} {c.lastName}
                    </span>
                    <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!c.isRead && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 50,
                      backgroundColor: "rgba(224,34,34,0.1)",
                      color: "#E02222",
                    }}>
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "#ccc", textAlign: "center", padding: "30px 0" }}>No contacts yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
