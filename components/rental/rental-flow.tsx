"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  MapPin,
  Star,
  CreditCard,
  Building,
  Clock,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface RentalFlowProps {
  machineId: string
}

// Mock data - same as machine details
const machineData = {
  id: "1",
  name: "Escavadeira Caterpillar 320D",
  category: "Escavadeiras",
  price: 12500,
  priceUnit: "mês",
  location: "São Paulo, SP",
  rating: 4.8,
  reviews: 24,
  images: ["/yellow-excavator-construction-site.png"],
  owner: {
    name: "João Construções",
    phone: "(11) 99999-9999",
    email: "contato@joaoconstrucoes.com",
  },
  specifications: {
    "Peso Operacional": "20.5 toneladas",
    "Potência do Motor": "122 kW (164 hp)",
    "Capacidade da Caçamba": "1.0 m³",
  },
}

const steps = [
  { id: 1, title: "Detalhes do Equipamento", description: "Confirme as informações" },
  { id: 2, title: "Informações de Contato", description: "Seus dados para contato" },
  { id: 3, title: "Detalhes da Locação", description: "Período e uso pretendido" },
  { id: 4, title: "Pagamento", description: "Método de pagamento" },
  { id: 5, title: "Revisão", description: "Confirme sua solicitação" },
]

export function RentalFlow({ machineId }: RentalFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Contact info
    name: "",
    email: "",
    phone: "",
    company: "",
    // Rental details
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    rentalPeriod: "days", // hours, days, weeks, months
    customPeriod: "",
    description: "",
    usageAddress: "",
    needsOperator: false,
    needsDelivery: true,
    // Payment
    paymentMethod: "",
    // Terms
    acceptTerms: false,
  })

  const machine = machineData

  const calculatePrice = () => {
    if (!formData.startDate || !formData.endDate) return 0

    const diffTime = formData.endDate.getTime() - formData.startDate.getTime()
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.ceil(diffDays / 7)
    const diffMonths = Math.ceil(diffDays / 30)

    const basePrice = machine.price // Price per month

    switch (formData.rentalPeriod) {
      case "hours":
        return Math.ceil((basePrice / 30 / 8) * diffHours) // Assuming 8 hours per day
      case "days":
        return Math.ceil((basePrice / 30) * diffDays)
      case "weeks":
        return Math.ceil((basePrice / 4) * diffWeeks)
      case "months":
        return basePrice * diffMonths
      default:
        return basePrice * diffMonths
    }
  }

  const getAdditionalCosts = () => {
    let additional = 0
    if (formData.needsOperator) additional += 2500 // Operator cost per month
    if (formData.needsDelivery) additional += 500 // Delivery cost
    return additional
  }

  const getTotalPrice = () => {
    return calculatePrice() + getAdditionalCosts()
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Here you would send the rental request to the API
    console.log("Rental request submitted:", formData)
    // Redirect to success page or show confirmation
    router.push("/contratos?tab=enviadas")
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return formData.name && formData.email && formData.phone
      case 3:
        return formData.startDate && formData.endDate && formData.description
      case 4:
        return formData.paymentMethod
      case 5:
        return formData.acceptTerms
      default:
        return false
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-16 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Equipment Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={machine.images[0] || "/placeholder.svg"}
                      alt={machine.name}
                      className="w-24 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        {machine.category}
                      </Badge>
                      <h3 className="text-xl font-semibold">{machine.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {machine.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {machine.rating} ({machine.reviews} avaliações)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">R$ {machine.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">por {machine.priceUnit}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Especificações Principais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(machine.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground">{key}:</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Proprietário</h4>
                    <p className="text-sm">{machine.owner.name}</p>
                    <p className="text-sm text-muted-foreground">{machine.owner.phone}</p>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Empresa (opcional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Rental Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Período de Locação</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="startDate">Data de Início *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate
                                ? format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })
                                : "Selecionar"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => setFormData({ ...formData, startDate: date })}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="endDate">Data de Término *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate
                                ? format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })
                                : "Selecionar"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) => setFormData({ ...formData, endDate: date })}
                              disabled={(date) => date < (formData.startDate || new Date())}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Unidade de Cobrança</Label>
                    <RadioGroup
                      value={formData.rentalPeriod}
                      onValueChange={(value) => setFormData({ ...formData, rentalPeriod: value })}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hours" id="hours" />
                        <Label htmlFor="hours">Por Horas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="days" id="days" />
                        <Label htmlFor="days">Por Dias</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weeks" id="weeks" />
                        <Label htmlFor="weeks">Por Semanas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="months" id="months" />
                        <Label htmlFor="months">Por Meses</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição do Uso *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva como pretende usar o equipamento, tipo de obra, etc."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="usageAddress">Endereço de Uso</Label>
                    <Input
                      id="usageAddress"
                      value={formData.usageAddress}
                      onChange={(e) => setFormData({ ...formData, usageAddress: e.target.value })}
                      placeholder="Endereço onde o equipamento será utilizado"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsOperator"
                        checked={formData.needsOperator}
                        onCheckedChange={(checked) => setFormData({ ...formData, needsOperator: checked as boolean })}
                      />
                      <Label htmlFor="needsOperator">Preciso de operador (+R$ 2.500/mês)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsDelivery"
                        checked={formData.needsDelivery}
                        onCheckedChange={(checked) => setFormData({ ...formData, needsDelivery: checked as boolean })}
                      />
                      <Label htmlFor="needsDelivery">Preciso de entrega e retirada (+R$ 500)</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Método de Pagamento</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">PIX</span>
                          </div>
                          PIX - Pagamento instantâneo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          Cartão de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                          <Building className="w-5 h-5 text-gray-600" />
                          Transferência Bancária
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="internal" id="internal" />
                        <Label htmlFor="internal" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="w-5 h-5 text-orange-600" />
                          Pagamento após aprovação (sistema interno)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Informações de Pagamento</h4>
                    <p className="text-sm text-muted-foreground">
                      O pagamento será processado após a aprovação da solicitação pelo proprietário. Você receberá as
                      instruções de pagamento por e-mail.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Resumo da Solicitação</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Equipamento:</span>
                          <p className="font-medium">{machine.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Proprietário:</span>
                          <p className="font-medium">{machine.owner.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Período:</span>
                          <p className="font-medium">
                            {formData.startDate && formData.endDate
                              ? `${format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })}`
                              : "Não definido"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cobrança:</span>
                          <p className="font-medium">
                            Por{" "}
                            {formData.rentalPeriod === "hours"
                              ? "horas"
                              : formData.rentalPeriod === "days"
                                ? "dias"
                                : formData.rentalPeriod === "weeks"
                                  ? "semanas"
                                  : "meses"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <span className="text-muted-foreground">Descrição do uso:</span>
                        <p className="font-medium">{formData.description}</p>
                      </div>

                      {formData.usageAddress && (
                        <div>
                          <span className="text-muted-foreground">Endereço de uso:</span>
                          <p className="font-medium">{formData.usageAddress}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-muted-foreground">Serviços adicionais:</span>
                        <div className="mt-1">
                          {formData.needsOperator && <p className="text-sm">• Operador incluído</p>}
                          {formData.needsDelivery && <p className="text-sm">• Entrega e retirada</p>}
                          {!formData.needsOperator && !formData.needsDelivery && (
                            <p className="text-sm">Nenhum serviço adicional</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Método de pagamento:</span>
                        <p className="font-medium">
                          {formData.paymentMethod === "pix" && "PIX"}
                          {formData.paymentMethod === "card" && "Cartão de Crédito"}
                          {formData.paymentMethod === "bank" && "Transferência Bancária"}
                          {formData.paymentMethod === "internal" && "Pagamento interno"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Aceito os termos e condições de locação
                    </Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Price Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor base:</span>
                  <span>R$ {calculatePrice().toLocaleString()}</span>
                </div>
                {formData.needsOperator && (
                  <div className="flex justify-between text-sm">
                    <span>Operador:</span>
                    <span>R$ 2.500</span>
                  </div>
                )}
                {formData.needsDelivery && (
                  <div className="flex justify-between text-sm">
                    <span>Entrega/Retirada:</span>
                    <span>R$ 500</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total Estimado:</span>
                <span className="text-primary">R$ {getTotalPrice().toLocaleString()}</span>
              </div>

              <div className="text-xs text-muted-foreground">* Valor final sujeito à aprovação do proprietário</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={!isStepValid()} className="flex items-center gap-2">
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!isStepValid()} className="flex items-center gap-2">
            Enviar Solicitação
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
