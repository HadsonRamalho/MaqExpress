"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, User, Phone, Mail, MapPin, Clock } from "lucide-react"

// Mock data for rentals
const rentalsData = {
  active: [
    {
      id: "1",
      machine: "Escavadeira Caterpillar 320D",
      renter: "Construtora ABC Ltda",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      totalValue: 12500,
      status: "active",
      contact: {
        name: "Carlos Silva",
        phone: "(11) 99999-8888",
        email: "carlos@construtorabc.com",
      },
      location: "Obra Residencial - Vila Madalena, SP",
    },
    {
      id: "2",
      machine: "Motoniveladora Caterpillar 140M",
      renter: "Terraplanagem XYZ",
      startDate: "2024-01-20",
      endDate: "2024-03-20",
      totalValue: 17000,
      status: "active",
      contact: {
        name: "Ana Santos",
        phone: "(11) 88888-7777",
        email: "ana@terraplanagem.com",
      },
      location: "Loteamento Industrial - Guarulhos, SP",
    },
  ],
  pending: [
    {
      id: "3",
      machine: "Betoneira 400L Profissional",
      renter: "João Pedreiro",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      totalValue: 1400,
      status: "pending",
      contact: {
        name: "João Pedreiro",
        phone: "(11) 77777-6666",
        email: "joao@email.com",
      },
      location: "Reforma Residencial - Moema, SP",
    },
  ],
  completed: [
    {
      id: "4",
      machine: "Compressor de Ar 10HP",
      renter: "Oficina do Zé",
      startDate: "2024-01-01",
      endDate: "2024-01-10",
      totalValue: 1800,
      status: "completed",
      contact: {
        name: "José Ferreira",
        phone: "(11) 66666-5555",
        email: "ze@oficina.com",
      },
      location: "Oficina Mecânica - Ipiranga, SP",
    },
    {
      id: "5",
      machine: "Escavadeira Caterpillar 320D",
      renter: "Construtora DEF",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      totalValue: 12500,
      status: "completed",
      contact: {
        name: "Maria Oliveira",
        phone: "(11) 55555-4444",
        email: "maria@construtoradef.com",
      },
      location: "Obra Comercial - Centro, SP",
    },
  ],
}

export function MyRentalsList() {
  const [activeTab, setActiveTab] = useState("active")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativa</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Concluída</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const RentalCard = ({ rental }: { rental: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{rental.machine}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Locação #{rental.id}</p>
          </div>
          {getStatusBadge(rental.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{rental.renter}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{rental.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-primary">R$ {rental.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{rental.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{rental.contact.email}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {rental.status === "pending" && (
            <>
              <Button size="sm" className="flex-1">
                Aprovar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                Recusar
              </Button>
            </>
          )}
          {rental.status === "active" && (
            <Button size="sm" variant="outline">
              Contatar Locatário
            </Button>
          )}
          {rental.status === "completed" && (
            <Button size="sm" variant="outline">
              Ver Detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Ativas ({rentalsData.active.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({rentalsData.pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídas ({rentalsData.completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {rentalsData.active.length > 0 ? (
            rentalsData.active.map((rental) => <RentalCard key={rental.id} rental={rental} />)
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma locação ativa</h3>
              <p className="text-muted-foreground">Suas locações ativas aparecerão aqui.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {rentalsData.pending.length > 0 ? (
            rentalsData.pending.map((rental) => <RentalCard key={rental.id} rental={rental} />)
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma locação pendente</h3>
              <p className="text-muted-foreground">Solicitações de locação aparecerão aqui.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {rentalsData.completed.length > 0 ? (
            rentalsData.completed.map((rental) => <RentalCard key={rental.id} rental={rental} />)
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma locação concluída</h3>
              <p className="text-muted-foreground">Seu histórico de locações aparecerá aqui.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
