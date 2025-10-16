"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Locação de Máquinas e Equipamentos</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          Encontre a máquina ideal para sua obra ou disponibilize seus equipamentos para locação com segurança e sem
          burocracia.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mb-16">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar Equipamentos..." className="pl-10 h-12 text-base" />
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Por Que Alugar Na MAQEXPRESS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-primary rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-lg mb-3">Variedade</h3>
              <p className="text-muted-foreground text-sm">
                Máquinas de diferentes categorias para atender sua necessidade, sempre disponíveis e prontas para uso.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-primary rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-lg mb-3">Facilidade</h3>
              <p className="text-muted-foreground text-sm">
                Processo 100% online, sem burocracia! Alugue em poucos cliques e receba onde precisar.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-primary rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-lg mb-3">Segurança</h3>
              <p className="text-muted-foreground text-sm">
                Garantimos que todos os usuários são verificados para evitar fraudes e proporcionar negociações seguras.
                Utilizamos contratos eletrônicos e criptografia para sua proteção.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-primary rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-lg mb-3">Suporte Agilizado</h3>
              <p className="text-muted-foreground text-sm">
                Nossa equipe está sempre pronta para ajudar, garantindo uma experiência ágil e sem complicações.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
