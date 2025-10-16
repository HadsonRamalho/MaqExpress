"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  DollarSign,
  Wrench,
  AlertTriangle,
  KanbanSquareDashed as MarkAsUnread,
  Trash2,
  Filter,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Notification {
  id: string
  type: "contract" | "payment" | "system" | "machine"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  priority: "low" | "medium" | "high"
  actionUrl?: string
  metadata?: {
    machineId?: string
    contractId?: string
    amount?: number
  }
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "contract",
    title: "Nova solicitação de locação",
    message: "João Silva solicitou a locação da sua Escavadeira Caterpillar 320D por 15 dias.",
    isRead: false,
    createdAt: "2024-01-20T10:30:00Z",
    priority: "high",
    actionUrl: "/contratos",
    metadata: { machineId: "1", contractId: "c1" },
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento recebido",
    message: "Você recebeu R$ 2.500,00 pela locação da Motoniveladora.",
    isRead: false,
    createdAt: "2024-01-19T15:45:00Z",
    priority: "medium",
    metadata: { amount: 2500 },
  },
  {
    id: "3",
    type: "contract",
    title: "Contrato aprovado",
    message: "Sua solicitação para alugar a Roçadeira foi aprovada. O período de locação inicia amanhã.",
    isRead: true,
    createdAt: "2024-01-19T09:15:00Z",
    priority: "high",
    actionUrl: "/contratos",
    metadata: { contractId: "c2" },
  },
  {
    id: "4",
    type: "machine",
    title: "Máquina próxima do vencimento",
    message: "A documentação da sua Caçamba vence em 7 dias. Renove para manter disponível.",
    isRead: true,
    createdAt: "2024-01-18T14:20:00Z",
    priority: "medium",
    metadata: { machineId: "4" },
  },
  {
    id: "5",
    type: "system",
    title: "Atualização do sistema",
    message: "Nova funcionalidade: Agora você pode configurar pagamentos automáticos.",
    isRead: true,
    createdAt: "2024-01-17T12:00:00Z",
    priority: "low",
  },
  {
    id: "6",
    type: "contract",
    title: "Solicitação recusada",
    message: "Sua solicitação para alugar o Compressor foi recusada pelo proprietário.",
    isRead: false,
    createdAt: "2024-01-16T16:30:00Z",
    priority: "medium",
    metadata: { contractId: "c3" },
  },
]

const getNotificationIcon = (type: string, priority: string) => {
  const iconClass = priority === "high" ? "text-red-500" : priority === "medium" ? "text-yellow-500" : "text-blue-500"

  switch (type) {
    case "contract":
      return <CheckCircle className={`h-5 w-5 ${iconClass}`} />
    case "payment":
      return <DollarSign className={`h-5 w-5 ${iconClass}`} />
    case "machine":
      return <Wrench className={`h-5 w-5 ${iconClass}`} />
    case "system":
      return <Bell className={`h-5 w-5 ${iconClass}`} />
    default:
      return <Bell className={`h-5 w-5 ${iconClass}`} />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="destructive" className="text-xs">
          Alta
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="secondary" className="text-xs">
          Média
        </Badge>
      )
    case "low":
      return (
        <Badge variant="outline" className="text-xs">
          Baixa
        </Badge>
      )
    default:
      return null
  }
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead)
    return notifications.filter((n) => n.type === activeTab)
  }, [notifications, activeTab])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAsUnread = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suas Notificações</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas as notificações foram lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Todas
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Não lidas {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="machine" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Máquinas
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
                <p className="text-muted-foreground">
                  {activeTab === "unread"
                    ? "Você não tem notificações não lidas."
                    : "Não há notificações nesta categoria."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? "border-l-4 border-l-primary bg-muted/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h3>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                            {notification.metadata?.amount && (
                              <span className="font-medium text-green-600">
                                R$ {notification.metadata.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={notification.actionUrl}>Ver detalhes</a>
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)
                            }
                          >
                            {notification.isRead ? (
                              <MarkAsUnread className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
