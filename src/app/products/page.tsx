"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#171200]">Products</h1>
        <Link
          href="/products/new"
          className="bg-[#E02222] text-white px-6 py-2 text-sm font-semibold hover:bg-[#c41e1e] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-[#171200]">Image</th>
              <th className="text-left p-4 font-semibold text-[#171200]">Name</th>
              <th className="text-left p-4 font-semibold text-[#171200]">Category</th>
              <th className="text-left p-4 font-semibold text-[#171200]">Price</th>
              <th className="text-left p-4 font-semibold text-[#171200]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={product.images[0] || "https://via.placeholder.com/60"}
                    alt=""
                    className="w-14 h-14 object-cover"
                  />
                </td>
                <td className="p-4 font-medium text-[#171200]">{product.name}</td>
                <td className="p-4 text-[#5f6360]">{product.category}</td>
                <td className="p-4 font-bold">${product.price}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/products/edit/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#5f6360]">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
