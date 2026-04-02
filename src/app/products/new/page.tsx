"use client";

import AdminLayout from "@/components/AdminLayout";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-[#171200] mb-8">Add New Product</h1>
      <div className="bg-white border border-gray-200 p-8">
        <ProductForm />
      </div>
    </AdminLayout>
  );
}
