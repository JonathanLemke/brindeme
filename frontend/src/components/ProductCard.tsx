// src/components/ProductCard.tsx
"use client";

import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  return (
    <div className="p-4 border rounded shadow hover:shadow-lg transition-shadow">
      <img
        src={
          product.image_path
            ? `http://localhost:8000/storage/${product.image_path}`
            : "/placeholder.png"
        }
        alt={product.name}
        className="w-full h-32 object-cover rounded"
      />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-500 text-sm mt-1">
        {product.description || "Sem descrição disponível."}
      </p>
      <p className="text-green-600 text-lg font-semibold mt-2">
        {price ? `R$ ${price.toFixed(2)}` : "Preço indisponível"}
      </p>
    </div>
  );
}
