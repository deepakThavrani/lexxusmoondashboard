"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import BlogForm from "@/components/BlogForm";

export default function EditBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/slug/${params.id}`);
        setBlog(res.data);
      } catch {
        try {
          const res = await api.get(`/blogs/admin/all`);
          const found = res.data.find(
            (b: { _id: string }) => b._id === params.id
          );
          if (found) {
            const full = await api.get(`/blogs/slug/${found.slug}`);
            setBlog(full.data);
          }
        } catch {
          setBlog(null);
        }
      }
      setLoading(false);
    };
    fetchBlog();
  }, [params.id]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-[#171200] mb-8">Edit Blog Post</h1>
      <div className="bg-white border border-gray-200 p-8">
        {loading ? (
          <p className="text-[#5f6360]">Loading...</p>
        ) : blog ? (
          <BlogForm initialData={blog} />
        ) : (
          <p className="text-[#5f6360]">Blog not found</p>
        )}
      </div>
    </AdminLayout>
  );
}
