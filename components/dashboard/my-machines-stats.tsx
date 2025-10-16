"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Wrench, Calendar, TrendingUp, Eye, Clock, CheckCircle } from "lucide-react"

// Mock data - in production, fetch from API
const statsData = {
  totalMachines: 8,
  activeMachines: 6,
  totalEarnings: 45600,
  monthlyEarnings: 12500,
  totalRentals: 34,
  activeRentals: 3,
  averageRating: 4.7,
  viewsThisMonth: 156,
}

const recentActivity = [
  {
    id: "1",
    type: "rental",
    message: "Nova locação da Escavadeira CAT 320D",
    time: "2 horas atrás",
    status: "success",
  },
  {
    id: "2",
    type: "view",
    message: "Sua Motoniveladora foi visualizada 5 vezes",
    time: "4 horas atrás",
    status: "info",
  },
  {
    id: "3",
    type: "payment",
    message: "Pagamento de R$ 8.500 recebido",
    time: "1 dia atrás",
    status: "success",
  },
  {
    id: "4",
    type: "review",
    message: "Nova avaliação 5 estrelas recebida",
    time: "2 dias atrás",
    status: "success",
  },
]

export function MyMachinesStats() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalMachines}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{statsData.activeMachines} ativas</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {statsData.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+R$ {statsData.monthlyEarnings.toLocaleString()}</span> este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalRentals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{statsData.activeRentals} ativas</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.viewsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "info"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Wrench className="h-4 w-4 mr-2" />
              Adicionar Nova Máquina
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Relatório Mensal
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Gerenciar Agenda
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Atualizar Disponibilidade
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho das Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Escavadeira CAT 320D</h3>
                  <p className="text-sm text-muted-foreground">Mais popular</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">R$ 12.500/mês</div>
                <div className="text-sm text-muted-foreground">Taxa de ocupação: 85%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Motoniveladora CAT 140M</h3>
                  <p className="text-sm text-muted-foreground">Boa demanda</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">R$ 8.500/mês</div>
                <div className="text-sm text-muted-foreground">Taxa de ocupação: 70%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Compressor 10HP</h3>
                  <p className="text-sm text-muted-foreground">Disponível</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">R$ 180/dia</div>
                <div className="text-sm text-muted-foreground">Taxa de ocupação: 45%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
