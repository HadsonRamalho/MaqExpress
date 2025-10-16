"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, Star, Heart, Share2, CalendarIcon, User, Phone, Mail, Shield, Truck, Wrench } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MachineDetailsProps {
  machineId: string
}

// Mock data - in production, fetch from API
const machineData = {
  id: "1",
  name: "Escavadeira Caterpillar 320D",
  category: "Escavadeiras",
  price: 12500,
  priceUnit: "mês",
  location: "São Paulo, SP",
  rating: 4.8,
  reviews: 24,
  images: ["/yellow-excavator-construction-site.png", "/excavator-construction.png"],
  available: true,
  owner: {
    name: "João Construções",
    rating: 4.9,
    totalRentals: 156,
    phone: "(11) 99999-9999",
    email: "contato@joaoconstrucoes.com",
    verified: true,
  },
  features: ["GPS", "Ar Condicionado", "Revisada"],
  specifications: {
    "Peso Operacional": "20.5 toneladas",
    "Potência do Motor": "122 kW (164 hp)",
    "Capacidade da Caçamba": "1.0 m³",
    "Alcance Máximo": "9.9 m",
    "Profundidade de Escavação": "6.7 m",
    Ano: "2019",
  },
  description:
    "Escavadeira Caterpillar 320D em excelente estado de conservação. Ideal para obras de médio e grande porte. Equipamento revisado e com todas as manutenções em dia. Inclui operador experiente se necessário.",
  terms: [
    "Seguro obrigatório incluído",
    "Manutenção preventiva incluída",
    "Combustível por conta do locatário",
    "Operador disponível por taxa adicional",
    "Entrega e retirada no local da obra",
  ],
}

export function MachineDetails({ machineId }: MachineDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const router = useRouter()

  const machine = machineData // In production, fetch by machineId

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const months = Math.ceil(days / 30)
    return machine.price * months
  }

  const handleRentClick = () => {
    router.push(`/alugar/${machineId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-[16/10] relative">
                <img
                  src={machine.images[selectedImage] || "/placeholder.svg"}
                  alt={machine.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {machine.images.length > 1 && (
                <div className="p-4 flex gap-2">
                  {machine.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-16 rounded border-2 overflow-hidden ${
                        selectedImage === index ? "border-primary" : "border-border"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${machine.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {machine.category}
                  </Badge>
                  <CardTitle className="text-2xl">{machine.name}</CardTitle>
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
                  <div className="text-3xl font-bold text-primary">R$ {machine.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">por {machine.priceUnit}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {machine.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{machine.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(machine.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">{key}:</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Termos e Condições</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {machine.terms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Reservar Equipamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Data Início</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium">Data Fim</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total estimado:</span>
                    <span className="font-bold">R$ {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button className="w-full" disabled={!startDate || !endDate} onClick={handleRentClick}>
                Alugar Equipamento
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Pagamento seguro e protegido</span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Proprietário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {machine.owner.name}
                    {machine.owner.verified && <Shield className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{machine.owner.totalRentals} locações realizadas</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {machine.owner.rating}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {machine.owner.phone}
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar mensagem
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Inclusos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Entrega e retirada</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Seguro incluído</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Wrench className="h-4 w-4 text-primary" />
                <span>Manutenção preventiva</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
