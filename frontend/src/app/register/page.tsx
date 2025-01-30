// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao registrar.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Seu nome completo"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="usuario@exemplo.com"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Sua senha"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Confirme a Senha</label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Confirme sua senha"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
        >
          Registrar
        </button>
        <p className="text-center mt-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-600 underline">
            Faça login
          </a>
        </p>
      </form>
    </div>
  );
}
