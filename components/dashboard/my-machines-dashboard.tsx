"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Wrench, TrendingUp } from "lucide-react"
import { MyMachinesStats } from "./my-machines-stats"
import { MyMachinesList } from "./my-machines-list"
import { MyRentalsList } from "./my-rentals-list"
import Link from "next/link"

export function MyMachinesDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Minhas Máquinas</h1>
          <p className="text-muted-foreground">Gerencie seus equipamentos e locações</p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/cadastrar-maquina">
            <Plus className="h-4 w-4" />
            Adicionar Máquina
          </Link>
        </Button>
      </div>

      {/* Welcome Card */}
      <Card className="mb-8 bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Bem-vindo, {user?.nome}!</h2>
              <p className="text-primary-foreground/80">
                Você tem equipamentos gerando renda. Continue expandindo seu negócio!
              </p>
            </div>
            <Wrench className="h-12 w-12 text-primary-foreground/80" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="machines">Minhas Máquinas</TabsTrigger>
          <TabsTrigger value="rentals">Locações</TabsTrigger>
          <TabsTrigger value="analytics">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MyMachinesStats />
        </TabsContent>

        <TabsContent value="machines" className="space-y-6">
          <MyMachinesList />
        </TabsContent>

        <TabsContent value="rentals" className="space-y-6">
          <MyRentalsList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e Análises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatórios em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Em breve você terá acesso a relatórios detalhados sobre suas locações e receitas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
