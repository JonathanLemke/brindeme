"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProducts(token)
      .then(setProducts)
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}