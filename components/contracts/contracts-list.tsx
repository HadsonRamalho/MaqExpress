"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Inbox, Send, CheckCircle, XCircle, Clock, MapPin, Calendar, DollarSign, Wrench, Eye } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

interface ContractRequest {
  id: string
  type: "received" | "sent"
  status: "pending" | "approved" | "rejected" | "active" | "completed"
  machine: {
    id: string
    name: string
    image: string
    category: string
    pricePerDay: number
  }
  requester: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
    }
  }
  owner: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
    }
  }
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  message?: string
  createdAt: string
  updatedAt: string
}

// Mock contract requests data
const mockContracts: ContractRequest[] = [
  {
    id: "1",
    type: "received",
    status: "pending",
    machine: {
      id: "1",
      name: "Escavadeira Caterpillar 320D",
      image: "/yellow-excavator-construction-site.png",
      category: "Escavadeiras",
      pricePerDay: 850,
    },
    requester: {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(11) 98765-4321",
      avatar: "/placeholder.svg?key=maria",
      address: {
        street: "Av. Paulista",
        number: "1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      },
    },
    owner: {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      },
    },
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    totalDays: 15,
    totalAmount: 12750,
    message: "Preciso da escavadeira para um projeto de construção residencial. Tenho experiência com o equipamento.",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    type: "sent",
    status: "approved",
    machine: {
      id: "3",
      name: "Roçadeira Profissional Stihl",
      image: "/brush-cutter-garden-equipment.png",
      category: "Ferramentas",
      pricePerDay: 150,
    },
    requester: {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      },
    },
    owner: {
      id: "3",
      name: "Carlos Jardim",
      email: "carlos.jardim@email.com",
      phone: "(11) 87654-3210",
      avatar: "/placeholder.svg?key=carlos",
      address: {
        street: "Rua Verde",
        number: "456",
        neighborhood: "Jardins",
        city: "São Paulo",
        state: "SP",
      },
    },
    startDate: "2024-01-25",
    endDate: "2024-01-27",
    totalDays: 3,
    totalAmount: 450,
    message: "Preciso para limpeza de terreno. Posso buscar e devolver no local.",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
  {
    id: "3",
    type: "received",
    status: "rejected",
    machine: {
      id: "2",
      name: "Motoniveladora Caterpillar 140M",
      image: "/motor-grader-construction-equipment.png",
      category: "Motoniveladoras",
      pricePerDay: 650,
    },
    requester: {
      id: "4",
      name: "Pedro Construções",
      email: "pedro@construcoes.com",
      phone: "(11) 76543-2109",
      avatar: "/placeholder.svg?key=pedro",
      address: {
        street: "Rua Industrial",
        number: "789",
        neighborhood: "Vila Madalena",
        city: "São Paulo",
        state: "SP",
      },
    },
    owner: {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      },
    },
    startDate: "2024-01-30",
    endDate: "2024-02-10",
    totalDays: 12,
    totalAmount: 7800,
    message: "Equipamento necessário para nivelamento de terreno para construção comercial.",
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-16T10:20:00Z",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      )
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Recusado
        </Badge>
      )
    case "active":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Wrench className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline">
          <CheckCircle className="h-3 w-3 mr-1" />
          Concluído
        </Badge>
      )
    default:
      return null
  }
}

export function ContractsList() {
  const [contracts, setContracts] = useState<ContractRequest[]>(mockContracts)
  const [activeTab, setActiveTab] = useState("received")

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => contract.type === activeTab)
  }, [contracts, activeTab])

  const handleApprove = async (contractId: string) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "approved", updatedAt: new Date().toISOString() }
          : contract,
      ),
    )
    toast({
      title: "Contrato aprovado",
      description: "A solicitação foi aprovada com sucesso.",
    })
  }

  const handleReject = async (contractId: string) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: "rejected", updatedAt: new Date().toISOString() }
          : contract,
      ),
    )
    toast({
      title: "Contrato recusado",
      description: "A solicitação foi recusada.",
      variant: "destructive",
    })
  }

  const receivedCount = contracts.filter((c) => c.type === "received").length
  const sentCount = contracts.filter((c) => c.type === "sent").length
  const pendingReceivedCount = contracts.filter((c) => c.type === "received" && c.status === "pending").length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Contratos</h2>
          <p className="text-muted-foreground">
            {pendingReceivedCount > 0
              ? `${pendingReceivedCount} solicitação${pendingReceivedCount > 1 ? "ões" : ""} pendente${
                  pendingReceivedCount > 1 ? "s" : ""
                }`
              : "Nenhuma solicitação pendente"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Recebidas ({receivedCount})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviadas ({sentCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredContracts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                {activeTab === "received" ? (
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                ) : (
                  <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                )}
                <h3 className="text-lg font-medium mb-2">Nenhum contrato encontrado</h3>
                <p className="text-muted-foreground">
                  {activeTab === "received"
                    ? "Você ainda não recebeu solicitações de locação."
                    : "Você ainda não enviou solicitações de locação."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <Card key={contract.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={contract.machine.image || "/placeholder.svg"}
                        alt={contract.machine.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{contract.machine.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{contract.machine.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contract.status)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Contrato</DialogTitle>
                            <DialogDescription>Informações completas sobre a solicitação de locação</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Machine Info */}
                            <div>
                              <h3 className="font-medium mb-3">Equipamento</h3>
                              <div className="flex items-center gap-4 p-4 border rounded-lg">
                                <img
                                  src={contract.machine.image || "/placeholder.svg"}
                                  alt={contract.machine.name}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">{contract.machine.name}</h4>
                                  <p className="text-sm text-muted-foreground">{contract.machine.category}</p>
                                  <p className="text-sm font-medium text-primary">
                                    R$ {contract.machine.pricePerDay}/dia
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* People Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-medium mb-3">
                                  {contract.type === "received" ? "Solicitante" : "Proprietário"}
                                </h3>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={
                                          contract.type === "received"
                                            ? contract.requester.avatar
                                            : contract.owner.avatar
                                        }
                                      />
                                      <AvatarFallback>
                                        {(contract.type === "received" ? contract.requester.name : contract.owner.name)
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {contract.type === "received" ? contract.requester.name : contract.owner.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {contract.type === "received" ? contract.requester.email : contract.owner.email}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm">
                                    {contract.type === "received" ? contract.requester.phone : contract.owner.phone}
                                  </p>
                                  <div className="text-sm text-muted-foreground">
                                    <p>
                                      {contract.type === "received"
                                        ? `${contract.requester.address.street}, ${contract.requester.address.number}`
                                        : `${contract.owner.address.street}, ${contract.owner.address.number}`}
                                    </p>
                                    <p>
                                      {contract.type === "received"
                                        ? `${contract.requester.address.neighborhood}, ${contract.requester.address.city}/${contract.requester.address.state}`
                                        : `${contract.owner.address.neighborhood}, ${contract.owner.address.city}/${contract.owner.address.state}`}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-medium mb-3">Período e Valor</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {format(new Date(contract.startDate), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                                      {format(new Date(contract.endDate), "dd/MM/yyyy", { locale: ptBR })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span>{contract.totalDays} dias</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <DollarSign className="h-4 w-4" />
                                    <span>R$ {contract.totalAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Message */}
                            {contract.message && (
                              <div>
                                <h3 className="font-medium mb-3">Mensagem</h3>
                                <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                                  {contract.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Person Info */}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={contract.type === "received" ? contract.requester.avatar : contract.owner.avatar}
                        />
                        <AvatarFallback>
                          {(contract.type === "received" ? contract.requester.name : contract.owner.name)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {contract.type === "received" ? contract.requester.name : contract.owner.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {contract.type === "received"
                              ? `${contract.requester.address.city}/${contract.requester.address.state}`
                              : `${contract.owner.address.city}/${contract.owner.address.state}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Period */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(contract.startDate), "dd/MM", { locale: ptBR })} -{" "}
                        {format(new Date(contract.endDate), "dd/MM", { locale: ptBR })} ({contract.totalDays} dias)
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {contract.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {contract.message && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      <strong>Mensagem:</strong> {contract.message}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {contract.status === "pending" ? "Solicitado" : "Atualizado"}{" "}
                      {formatDistanceToNow(new Date(contract.updatedAt), { addSuffix: true, locale: ptBR })}
                    </span>

                    {contract.type === "received" && contract.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <XCircle className="h-4 w-4 mr-2" />
                              Recusar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Recusar solicitação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja recusar esta solicitação de locação? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleReject(contract.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Recusar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Aprovar solicitação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Confirma a aprovação desta solicitação de locação? O contrato será ativado e o
                                solicitante será notificado.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleApprove(contract.id)}>Aprovar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
