"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ImageUploader from "./ImageUploader";

const categories = [
  "Exterior Rendering",
  "Interior Rendering",
  "Walkthrough",
  "3D Floor Plan",
];

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    features: string[];
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?._id;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || categories[0],
    images: initialData?.images || [],
    features: initialData?.features || [],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${initialData._id}`, form);
      } else {
        await api.post("/products", form);
      }
      router.push("/products");
    } catch {
      alert("Failed to save product");
    }
    setSaving(false);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const handleImageUploaded = (url: string) => {
    setForm({ ...form, images: [...form.images, url] });
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[#171200] mb-2">
          Product Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#E02222]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#171200] mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={5}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#E02222]"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#171200] mb-2">
            Price ($)
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
            min={0}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#E02222]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#171200] mb-2">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#E02222]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-[#171200] mb-2">
          Images
        </label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-24 h-24">
              <img src={img} alt="" className="w-full h-full object-cover border" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <ImageUploader onUploaded={handleImageUploaded} />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-semibold text-[#171200] mb-2">
          Features
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Add a feature"
            className="flex-1 border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-[#E02222]"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-gray-900 text-white px-4 py-2 text-sm"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {form.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#5f6360]">
              <span>• {f}</span>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-red-500 text-xs"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-[#E02222] text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-[#c41e1e] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
