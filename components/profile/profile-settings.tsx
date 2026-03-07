"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon, MapPin, Settings, Save } from "lucide-react"
import { toast } from "sonner"
import { serviceAutenticacao as AuthService} from "@/services/auth"
import { PerfilPrivadoUsuario } from "@/interfaces"

export function ProfileSettings({ initialUser }: { initialUser: PerfilPrivadoUsuario }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: initialUser.nome,
    email: initialUser.email,
    cpf: initialUser.cpf
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await AuthService.atualizarPerfil({
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf
      })
      toast.success("Perfil atualizado com sucesso")
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">{formData.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{formData.nome}</h2>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal"><UserIcon className="h-4 w-4 mr-2" /> Pessoal</TabsTrigger>
          <TabsTrigger value="address"><MapPin className="h-4 w-4 mr-2" /> Endereço</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" /> Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" /> {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
            <Card><CardContent className="p-8 text-center text-muted-foreground">Funcionalidade de endereço vinculada ao EnderecoService em desenvolvimento.</CardContent></Card>
        </TabsContent>

        <TabsContent value="settings">
            <Card><CardContent className="p-8 text-center text-muted-foreground">Configurações de segurança e autenticação.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
