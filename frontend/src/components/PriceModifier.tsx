// src/components/PriceModifier.tsx
"use client";

import { useState } from "react";
import { modifyProductPrices } from "@/lib/products";
import { useRouter } from "next/navigation";

export default function PriceModifier() {
  const [percentage, setPercentage] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
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
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">Modificar Preços</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("sucesso") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <input
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        placeholder="Digite o percentual (-10 ou 10)"
        className="p-2 border rounded-lg w-full"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Atualizar Preços
      </button>
    </div>
  );
}
