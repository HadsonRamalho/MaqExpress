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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, MapPin, Wrench, FileText, Camera, Settings, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const categories = [
  "Escavadeiras",
  "Tratores",
  "Caminhões",
  "Betoneiras",
  "Compressores",
  "Geradores",
  "Ferramentas",
  "Motoniveladoras",
  "Retroescavadeiras",
  "Guindastes",
  "Rolos Compactadores",
]

const states = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PR", label: "Paraná" },
  { value: "SC", label: "Santa Catarina" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "BA", label: "Bahia" },
  { value: "GO", label: "Goiás" },
]

interface FormData {
  name: string
  category: string
  description: string
  price: string
  priceUnit: string
  city: string
  state: string
  specifications: string
  features: string[]
  condition: string
  year: string
  brand: string
  model: string
  isAvailable: boolean
  requiresOperator: boolean
  deliveryAvailable: boolean
  minRentalDays: string
  maxRentalDays: string
  allowedPeriods: {
    hours: boolean
    days: boolean
    weeks: boolean
    months: boolean
  }
  periodLimits: {
    hours: { min: string; max: string }
    days: { min: string; max: string }
    weeks: { min: string; max: string }
    months: { min: string; max: string }
  }
  periodPrices: {
    hours: string
    days: string
    weeks: string
    months: string
  }
}

const AddMachineForm = ({ machineData, isEditing = false }: { machineData?: any; isEditing?: boolean }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: machineData?.name || "",
    category: machineData?.category || "",
    description: machineData?.description || "",
    price: machineData?.price?.toString() || "",
    priceUnit: machineData?.priceUnit || "dia",
    city: machineData?.city || "",
    state: machineData?.state || "",
    specifications: machineData?.specifications || "",
    features: machineData?.features || [],
    condition: machineData?.condition || "",
    year: machineData?.year?.toString() || "",
    brand: machineData?.brand || "",
    model: machineData?.model || "",
    isAvailable: machineData?.isAvailable ?? true,
    requiresOperator: machineData?.requiresOperator ?? false,
    deliveryAvailable: machineData?.deliveryAvailable ?? false,
    minRentalDays: machineData?.minRentalDays?.toString() || "1",
    maxRentalDays: machineData?.maxRentalDays?.toString() || "30",
    allowedPeriods: machineData?.allowedPeriods || {
      hours: false,
      days: true,
      weeks: true,
      months: false,
    },
    periodLimits: machineData?.periodLimits || {
      hours: { min: "4", max: "24" },
      days: { min: "1", max: "30" },
      weeks: { min: "1", max: "12" },
      months: { min: "1", max: "6" },
    },
    periodPrices: machineData?.periodPrices || {
      hours: "",
      days: "",
      weeks: "",
      months: "",
    },
  })
  const [images, setImages] = useState<string[]>(machineData?.images || [])
  const [isLoading, setIsLoading] = useState(false)
  const [currentFeature, setCurrentFeature] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação básica
      if (!formData.name || !formData.category || !formData.city || !formData.state) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }

      const selectedPeriods = Object.entries(formData.allowedPeriods).filter(([_, enabled]) => enabled)
      if (selectedPeriods.length === 0) {
        toast({
          title: "Períodos obrigatórios",
          description: "Selecione pelo menos um período de locação.",
          variant: "destructive",
        })
        return
      }

      for (const [period, enabled] of selectedPeriods) {
        if (enabled && !formData.periodPrices[period as keyof typeof formData.periodPrices]) {
          toast({
            title: "Preços obrigatórios",
            description: `Defina o preço para o período: ${period === "hours" ? "horas" : period === "days" ? "dias" : period === "weeks" ? "semanas" : "meses"}.`,
            variant: "destructive",
          })
          return
        }
      }

      if (images.length === 0) {
        toast({
          title: "Imagens obrigatórias",
          description: "Adicione pelo menos uma foto da máquina.",
          variant: "destructive",
        })
        return
      }

      // Simular envio - em produção, fazer chamada para API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: isEditing ? "Máquina atualizada!" : "Máquina cadastrada!",
        description: isEditing
          ? "Suas alterações foram salvas com sucesso."
          : "Sua máquina foi adicionada com sucesso e está disponível para locação.",
      })

      // Redirecionar para dashboard
      router.push("/minhas-maquinas")
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing
          ? "Não foi possível atualizar a máquina. Tente novamente."
          : "Não foi possível cadastrar a máquina. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePeriodChange = (period: keyof FormData["allowedPeriods"], checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allowedPeriods: {
        ...prev.allowedPeriods,
        [period]: checked,
      },
    }))
  }

  const handlePeriodLimitChange = (period: keyof FormData["periodLimits"], type: "min" | "max", value: string) => {
    setFormData((prev) => ({
      ...prev,
      periodLimits: {
        ...prev.periodLimits,
        [period]: {
          ...prev.periodLimits[period],
          [type]: value,
        },
      },
    }))
  }

  const handlePeriodPriceChange = (period: keyof FormData["periodPrices"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      periodPrices: {
        ...prev.periodPrices,
        [period]: value,
      },
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 8)) // Máximo 8 imagens
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }))
      setCurrentFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Máquina *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Escavadeira Caterpillar 320D"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Ex: Caterpillar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Ex: 320D"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2020"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva sua máquina, estado de conservação, características especiais..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location and Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localização e Preço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceUnit">Unidade</Label>
                <Select value={formData.priceUnit} onValueChange={(value) => handleInputChange("priceUnit", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dia">Por dia</SelectItem>
                    <SelectItem value="semana">Por semana</SelectItem>
                    <SelectItem value="mês">Por mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Estado</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="seminovo">Seminovo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                    <SelectItem value="revisado">Revisado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Especificações Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specifications">Especificações</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleInputChange("specifications", e.target.value)}
                placeholder="Ex: Peso: 20.5t, Potência: 164hp, Capacidade da caçamba: 1.2m³..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Características e Equipamentos</Label>
              <div className="flex gap-2">
                <Input
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Ex: GPS, Ar Condicionado, Revisada"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  Adicionar
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Fotos da Máquina
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Adicione fotos da sua máquina</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione até 8 fotos. Fotos de qualidade aumentam as chances de locação.
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                Selecionar Fotos
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Locação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isAvailable">Disponível para locação</Label>
                    <p className="text-sm text-muted-foreground">Sua máquina aparecerá nas buscas</p>
                  </div>
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleInputChange("isAvailable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requiresOperator">Requer operador</Label>
                    <p className="text-sm text-muted-foreground">Máquina só aluga com operador</p>
                  </div>
                  <Switch
                    id="requiresOperator"
                    checked={formData.requiresOperator}
                    onCheckedChange={(checked) => handleInputChange("requiresOperator", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deliveryAvailable">Entrega disponível</Label>
                    <p className="text-sm text-muted-foreground">Você pode entregar a máquina</p>
                  </div>
                  <Switch
                    id="deliveryAvailable"
                    checked={formData.deliveryAvailable}
                    onCheckedChange={(checked) => handleInputChange("deliveryAvailable", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minRentalDays">Período mínimo (dias)</Label>
                  <Input
                    id="minRentalDays"
                    type="number"
                    value={formData.minRentalDays}
                    onChange={(e) => handleInputChange("minRentalDays", e.target.value)}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRentalDays">Período máximo (dias)</Label>
                  <Input
                    id="maxRentalDays"
                    type="number"
                    value={formData.maxRentalDays}
                    onChange={(e) => handleInputChange("maxRentalDays", e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Periods Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Períodos de Locação Permitidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {/* Hours */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hours"
                    checked={formData.allowedPeriods.hours}
                    onCheckedChange={(checked) => handlePeriodChange("hours", checked as boolean)}
                  />
                  <Label htmlFor="hours" className="text-base font-medium">
                    Por Horas
                  </Label>
                </div>
                {formData.allowedPeriods.hours && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço por hora (R$)</Label>
                      <Input
                        type="number"
                        value={formData.periodPrices.hours}
                        onChange={(e) => handlePeriodPriceChange("hours", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mínimo (horas)</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.hours.min}
                        onChange={(e) => handlePeriodLimitChange("hours", "min", e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo (horas) - Opcional</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.hours.max}
                        onChange={(e) => handlePeriodLimitChange("hours", "max", e.target.value)}
                        min="1"
                        placeholder="Sem limite"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Days */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="days"
                    checked={formData.allowedPeriods.days}
                    onCheckedChange={(checked) => handlePeriodChange("days", checked as boolean)}
                  />
                  <Label htmlFor="days" className="text-base font-medium">
                    Por Dias
                  </Label>
                </div>
                {formData.allowedPeriods.days && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço por dia (R$)</Label>
                      <Input
                        type="number"
                        value={formData.periodPrices.days}
                        onChange={(e) => handlePeriodPriceChange("days", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mínimo (dias)</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.days.min}
                        onChange={(e) => handlePeriodLimitChange("days", "min", e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo (dias) - Opcional</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.days.max}
                        onChange={(e) => handlePeriodLimitChange("days", "max", e.target.value)}
                        min="1"
                        placeholder="Sem limite"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Weeks */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weeks"
                    checked={formData.allowedPeriods.weeks}
                    onCheckedChange={(checked) => handlePeriodChange("weeks", checked as boolean)}
                  />
                  <Label htmlFor="weeks" className="text-base font-medium">
                    Por Semanas
                  </Label>
                </div>
                {formData.allowedPeriods.weeks && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço por semana (R$)</Label>
                      <Input
                        type="number"
                        value={formData.periodPrices.weeks}
                        onChange={(e) => handlePeriodPriceChange("weeks", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mínimo (semanas)</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.weeks.min}
                        onChange={(e) => handlePeriodLimitChange("weeks", "min", e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo (semanas) - Opcional</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.weeks.max}
                        onChange={(e) => handlePeriodLimitChange("weeks", "max", e.target.value)}
                        min="1"
                        placeholder="Sem limite"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Months */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="months"
                    checked={formData.allowedPeriods.months}
                    onCheckedChange={(checked) => handlePeriodChange("months", checked as boolean)}
                  />
                  <Label htmlFor="months" className="text-base font-medium">
                    Por Meses
                  </Label>
                </div>
                {formData.allowedPeriods.months && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço por mês (R$)</Label>
                      <Input
                        type="number"
                        value={formData.periodPrices.months}
                        onChange={(e) => handlePeriodPriceChange("months", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mínimo (meses)</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.months.min}
                        onChange={(e) => handlePeriodLimitChange("months", "min", e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo (meses) - Opcional</Label>
                      <Input
                        type="number"
                        value={formData.periodLimits.months.max}
                        onChange={(e) => handlePeriodLimitChange("months", "max", e.target.value)}
                        min="1"
                        placeholder="Sem limite"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Selecione os períodos que você deseja disponibilizar para locação. Defina preços
                competitivos e limites adequados para cada período. Os campos de máximo são opcionais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading
              ? isEditing
                ? "Salvando..."
                : "Cadastrando..."
              : isEditing
                ? "Salvar Alterações"
                : "Cadastrar Máquina"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export { AddMachineForm }
