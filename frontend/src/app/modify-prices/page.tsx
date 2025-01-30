// src/app/modify-prices/page.tsx
"use client";

import { useState } from "react";
import { modifyProductPrices } from "@/lib/products";
import { useRouter } from "next/navigation";

export default function ModifyPricesPage() {
  const [percentage, setPercentage] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const percentNumber = parseFloat(percentage);
    if (isNaN(percentNumber)) {
      setMessage("Por favor, insira um valor válido.");
      return;
    }

    if (percentNumber < -100 || percentNumber > 100) {
      setMessage("O percentual deve estar entre -100% e +100%.");
      return;
    }

    try {
      await modifyProductPrices(percentNumber);
      setMessage("Preços atualizados com sucesso!");
      setPercentage("");

      router.push("/products");
    } catch (error: any) {
      setMessage(error.message || "Erro ao modificar preços.");
      console.error("Erro ao modificar preços:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Modificar Preços</h1>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("sucesso") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Percentual de Alteração (%)
          <input
            type="number"
            step="0.01"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Ex: 20 para +20% ou -10 para -10%"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Atualizar Preços
        </button>
      </form>
    </div>
  );
}
