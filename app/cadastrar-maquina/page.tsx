"use client"

import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddMachineForm } from "@/components/machines/add-machine-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AddMachinePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-balance mb-2">Cadastrar Máquina</h1>
            <p className="text-muted-foreground">Adicione uma nova máquina para locação na plataforma</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <AddMachineForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
