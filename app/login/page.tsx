import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance">Entrar na sua conta</h1>
            <p className="text-muted-foreground mt-2">Acesse sua conta para gerenciar suas locações</p>
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-primary hover:underline font-medium">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
