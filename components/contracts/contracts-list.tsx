"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Inbox, CheckCircle, XCircle, Clock, Calendar, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { serviceSolicitacao } from "@/services/solicitacao"
import { SolicitacaoContrato } from "@/interfaces"

export function ContractsList({ initialData }: { initialData: SolicitacaoContrato[] }) {
  const [contracts, setContracts] = useState<SolicitacaoContrato[]>(initialData)
  const [activeTab, setActiveTab] = useState("all")

  const filteredContracts = useMemo(() => {
    if (activeTab === "all") return contracts
    return contracts.filter((c) => c.status.toLowerCase() === activeTab)
  }, [contracts, activeTab])

  const handleResponse = async (id: string, status: "Aprovada" | "Rejeitada") => {
    try {
      await serviceSolicitacao.responder(id, status)
      setContracts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      )
      toast.success(`Solicitação ${status.toLowerCase()} com sucesso`)
    } catch (error: any) {
      toast.error("Erro ao processar resposta")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pendente</Badge>
      case "Aprovada":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Aprovada</Badge>
      case "Rejeitada":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Solicitações</h2>
          <p className="text-muted-foreground">Acompanhe seus pedidos de locação</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovada">Aprovadas</TabsTrigger>
          <TabsTrigger value="rejeitada">Rejeitadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredContracts.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma solicitação encontrada</CardContent></Card>
          ) : (
            filteredContracts.map((contract) => (
              <Card key={contract.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg"><FileText className="h-8 w-8 text-primary" /></div>
                      <div>
                        <CardTitle className="text-lg">Contrato #{contract.id_publico}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID Máquina: {contract.id_maquina}</p>
                      </div>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(contract.data_inicio), "dd/MM/yyyy", { locale: ptBR })} -
                      {format(new Date(contract.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>

                  {contract.status === "Pendente" && (
                    <div className="flex justify-end gap-2 pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Rejeitar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Rejeitar Solicitação?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleResponse(contract.id, "Rejeitada")}>Confirmar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm">Aprovar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Aprovar Solicitação?</AlertDialogTitle>
                            <AlertDialogDescription>O contrato será gerado automaticamente.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleResponse(contract.id, "Aprovada")}>Aprovar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
