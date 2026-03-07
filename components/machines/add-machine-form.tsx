"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Wrench, MapPin, FileText, Settings } from "lucide-react"
import { toast } from "sonner"
import { serviceMaquina } from "@/services/maquina"
import { Maquina, UUID } from "@/interfaces"

interface AddMachineFormProps {
  initialData?: Maquina
  isEditing?: boolean
}

export function AddMachineForm({ initialData, isEditing = false }: AddMachineFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    descricao: initialData?.descricao || "",
    numero_serie: initialData?.numero_serie || "",
    id_empresa: initialData?.id_empresa || undefined,
    ativo: initialData?.ativo ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && initialData) {
        await serviceMaquina.atualizar(initialData.id, {
            ...formData,
            nome: formData.nome,
            descricao: formData.descricao,
            numero_serie: formData.numero_serie,
            id_empresa: formData.id_empresa as UUID,
            ativo: formData.ativo
        })
        toast.success("Máquina atualizada com sucesso")
      } else {
        await serviceMaquina.cadastrar({
            nome: formData.nome,
            descricao: formData.descricao,
            numero_serie: formData.numero_serie,
            id_empresa: formData.id_empresa as UUID
        })
        toast.success("Máquina cadastrada com sucesso")
      }
      router.push("/minhas-maquinas")
      router.refresh()
    } catch (error: any) {
      toast.error("Erro ao salvar dados da máquina")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Informações Gerais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Máquina *</Label>
              <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Número de Série *</Label>
              <Input value={formData.numero_serie} onChange={(e) => setFormData({...formData, numero_serie: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Máquina Ativa e Disponível</Label>
            <Switch checked={formData.ativo} onCheckedChange={(checked) => setFormData({...formData, ativo: checked})} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Máquina"}
        </Button>
      </div>
    </form>
  )
}
