"use client"

import { useState } from "react"
import { useAuth, type User, type Address, type BankInfo } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  UserIcon,
  MapPin,
  CreditCard,
  Settings,
  Upload,
  Save,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

const mockFinancialData = {
  balance: 2450.75,
  transactions: [
    {
      id: "1",
      type: "credit" as const,
      description: "Locação - Escavadeira CAT 320",
      amount: 850.0,
      date: "2024-01-15",
      status: "completed" as const,
    },
    {
      id: "2",
      type: "debit" as const,
      description: "Locação - Motoniveladora Volvo",
      amount: 320.0,
      date: "2024-01-12",
      status: "completed" as const,
    },
    {
      id: "3",
      type: "credit" as const,
      description: "Locação - Roçadeira Husqvarna",
      amount: 150.0,
      date: "2024-01-10",
      status: "pending" as const,
    },
    {
      id: "4",
      type: "debit" as const,
      description: "Taxa de serviço",
      amount: 25.5,
      date: "2024-01-08",
      status: "completed" as const,
    },
    {
      id: "5",
      type: "credit" as const,
      description: "Locação - Caçamba Volvo",
      amount: 1200.0,
      date: "2024-01-05",
      status: "completed" as const,
    },
  ],
}

export function ProfileSettings() {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>(user || {})
  const [pixTransfer, setPixTransfer] = useState({
    pixKey: "",
    amount: "",
    description: "",
  })
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  if (!user) return null

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value } as Address,
    }))
  }

  const handleBankInfoChange = (field: keyof BankInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankInfo: { ...prev.bankInfo, [field]: value } as BankInfo,
    }))
  }

  const handleSave = async (tab: string) => {
    setIsLoading(tab)
    try {
      const success = await updateProfile(formData)
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        })
      } else {
        throw new Error("Falha ao atualizar perfil")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handlePixTransfer = async () => {
    if (!pixTransfer.pixKey || !pixTransfer.amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(pixTransfer.amount)
    if (amount <= 0 || amount > mockFinancialData.balance) {
      toast({
        title: "Erro",
        description: "Valor inválido ou saldo insuficiente.",
        variant: "destructive",
      })
      return
    }

    setIsLoading("transfer")
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Transferência realizada",
        description: `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} transferido via PIX.`,
      })

      setPixTransfer({ pixKey: "", amount: "", description: "" })
      setIsTransferOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar a transferência. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar || user.avatar} alt={user?.nome} />
                <AvatarFallback className="text-2xl">
                  {user?.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.nome}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}</Badge>
                {user.useInternalPayment ? (
                  <Badge className="bg-green-100 text-green-800">Pagamento Interno</Badge>
                ) : (
                  <Badge variant="outline">Transferência Bancária</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Pessoal
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave("personal")} disabled={isLoading === "personal"} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading === "personal" ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.address?.street || ""}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address?.number || ""}
                    onChange={(e) => handleAddressChange("number", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.address?.complement || ""}
                    onChange={(e) => handleAddressChange("complement", e.target.value)}
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.address?.neighborhood || ""}
                    onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ""}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={formData.address?.state || ""}
                    onValueChange={(value) => handleAddressChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode || ""}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave("address")} disabled={isLoading === "address"} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading === "address" ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Pagamento Interno</h3>
                  <p className="text-sm text-muted-foreground">
                    Use o sistema interno do MaqExpress para receber pagamentos
                  </p>
                </div>
                <Switch
                  checked={formData.useInternalPayment || false}
                  onCheckedChange={(checked) => handleInputChange("useInternalPayment", checked)}
                />
              </div>

              {!formData.useInternalPayment && (
                <div className="space-y-4">
                  <h3 className="font-medium">Informações Bancárias</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Banco</Label>
                      <Input
                        id="bank"
                        value={formData.bankInfo?.bank || ""}
                        onChange={(e) => handleBankInfoChange("bank", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agency">Agência</Label>
                      <Input
                        id="agency"
                        value={formData.bankInfo?.agency || ""}
                        onChange={(e) => handleBankInfoChange("agency", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Conta</Label>
                      <Input
                        id="account"
                        value={formData.bankInfo?.account || ""}
                        onChange={(e) => handleBankInfoChange("account", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Tipo de Conta</Label>
                      <Select
                        value={formData.bankInfo?.accountType || ""}
                        onValueChange={(value) => handleBankInfoChange("accountType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corrente">Conta Corrente</SelectItem>
                          <SelectItem value="poupanca">Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixKey">Chave PIX (opcional)</Label>
                    <Input
                      id="pixKey"
                      value={formData.bankInfo?.pixKey || ""}
                      onChange={(e) => handleBankInfoChange("pixKey", e.target.value)}
                      placeholder="E-mail, CPF, telefone ou chave aleatória"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave("payment")} disabled={isLoading === "payment"} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading === "payment" ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {mockFinancialData.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-4">
                    <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Transferir via PIX
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transferir via PIX</DialogTitle>
                          <DialogDescription>Transfira seu saldo para uma conta bancária usando PIX</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pixKey">Chave PIX *</Label>
                            <Input
                              id="pixKey"
                              placeholder="E-mail, CPF, telefone ou chave aleatória"
                              value={pixTransfer.pixKey}
                              onChange={(e) => setPixTransfer((prev) => ({ ...prev, pixKey: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Valor *</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0,00"
                              step="0.01"
                              min="0.01"
                              max={mockFinancialData.balance}
                              value={pixTransfer.amount}
                              onChange={(e) => setPixTransfer((prev) => ({ ...prev, amount: e.target.value }))}
                            />
                            <p className="text-xs text-muted-foreground">
                              Saldo disponível: R${" "}
                              {mockFinancialData.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Descrição (opcional)</Label>
                            <Input
                              id="description"
                              placeholder="Motivo da transferência"
                              value={pixTransfer.description}
                              onChange={(e) => setPixTransfer((prev) => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Informações importantes:</strong>
                              <br />• Taxa de transferência: R$ 1,00
                              <br />• Processamento: Instantâneo (24h/dia)
                              <br />• Limite diário: R$ 5.000,00
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsTransferOpen(false)} className="flex-1">
                              Cancelar
                            </Button>
                            <Button onClick={handlePixTransfer} disabled={isLoading === "transfer"} className="flex-1">
                              {isLoading === "transfer" ? "Processando..." : "Confirmar Transferência"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receitas do Mês</p>
                      <p className="text-2xl font-bold text-blue-600">R$ 2.200,00</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gastos do Mês</p>
                      <p className="text-2xl font-bold text-orange-600">R$ 345,50</p>
                    </div>
                    <ArrowDownLeft className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Extrato de Movimentações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}R${" "}
                          {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status === "completed" ? "Concluído" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Notificações por E-mail</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações sobre suas locações</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Notificações Push</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Perfil Público</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave("settings")} disabled={isLoading === "settings"} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading === "settings" ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
