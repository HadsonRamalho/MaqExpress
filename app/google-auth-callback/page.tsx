"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/layouts/default";
import { useAuth } from "@/hooks/auth";


function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // bloqueia execução dupla no React Strict Mode
  const processedRef = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (processedRef.current) return;

      const code = searchParams.get("code");
      if (!code) {
        setStatus("error");
        setErrorMessage("Código de autenticação não encontrado.");
        return;
      }

      processedRef.current = true;

      try {
        const googleRes = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!googleRes.ok) {
          throw new Error(await googleRes.text() || "Falha ao validar código Google");
        }

        const googleData = await googleRes.json();
        console.log("Google Auth Sucesso:", googleData.email);

        // 3. Busca o ID do usuário no seu backend
        const userRes = await fetch(
          `${API_URL}/busca_usuario_email/?email=${encodeURIComponent(googleData.email)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!userRes.ok) {
          throw new Error("Usuário não encontrado no sistema.");
        }

        const userId = await userRes.json();

        localStorage.setItem("USER_ID", userId);
        localStorage.setItem("PROFILE_IMAGE_URL", googleData.picture);

        await signIn({ email: googleData.email, password: googleData.email });

        setStatus("success");

        router.push("/user-profile");

      } catch (error: any) {
        console.error("Erro no fluxo de autenticação:", error);
        setStatus("error");
        setErrorMessage(error.message || "Ocorreu um erro inesperado.");
        processedRef.current = false;
      }
    };

    handleAuth();
  }, [searchParams, router, signIn]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-bold">Autenticando...</h1>
            <p className="text-gray-500">Por favor, aguarde enquanto validamos seus dados.</p>
          </>
        )}

        {status === "success" && (
          <h1 className="text-green-600 font-bold">Autenticado com sucesso! Redirecionando...</h1>
        )}

        {status === "error" && (
          <div className="text-center">
            <h1 className="text-red-500 font-bold text-xl">Falha na Autenticação</h1>
            <p className="text-gray-400 mt-2">{errorMessage}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar para Login
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default GoogleAuthCallback;
