"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        setProduct(res.data);
      } catch {
        setProduct(null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-[#171200] mb-8">Edit Product</h1>
      <div className="bg-white border border-gray-200 p-8">
        {loading ? (
          <p className="text-[#5f6360]">Loading...</p>
        ) : product ? (
          <ProductForm initialData={product} />
        ) : (
          <p className="text-[#5f6360]">Product not found</p>
        )}
      </div>
    </AdminLayout>
  );
}
