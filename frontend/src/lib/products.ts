// src/lib/products.ts
import { apiRequest } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string; // Ajustado para permitir string
  image_path: string;
}

export async function getProducts() {
  return await apiRequest("/products");
}

export async function modifyProductPrices(percent: number) {
  return await apiRequest("/products/update-price", {
    method: "POST",
    body: { percent }, // Envia 'percent', que é o esperado pelo backend
  });
}
