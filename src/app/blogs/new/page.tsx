"use client";

import AdminLayout from "@/components/AdminLayout";
import BlogForm from "@/components/BlogForm";

export default function NewBlogPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-[#171200] mb-8">Create Blog Post</h1>
      <div className="bg-white border border-gray-200 p-8">
        <BlogForm />
      </div>
    </AdminLayout>
  );
}
