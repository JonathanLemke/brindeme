// src/app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts, Product } from "@/lib/products";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "minPrice") {
      setMinPrice(value);
    } else if (key === "maxPrice") {
      setMaxPrice(value);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (minPrice) {
      filtered = filtered.filter((product) => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((product) => product.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetar para a primeira página após filtragem
  }, [minPrice, maxPrice, products]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Produtos</h1>
      <Filter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onFilterChange={handleFilterChange}
      />
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
