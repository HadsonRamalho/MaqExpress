import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Users,
  Shield,
  Wrench,
  Phone,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Como Funciona</h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
              Alugar equipamentos nunca foi tão fácil. Descubra como nossa plataforma simplifica todo o processo de
              locação.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Para Locatários</h2>
              <p className="text-lg text-muted-foreground">Alugue equipamentos em 4 passos simples</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className="absolute -top-3 -right-3 bg-primary text-primary-foreground">1</Badge>
                  <CardTitle className="text-lg">Busque</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Encontre o equipamento ideal usando nossos filtros por categoria, localização e preço.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className="absolute -top-3 -right-3 bg-primary text-primary-foreground">2</Badge>
                  <CardTitle className="text-lg">Reserve</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Selecione as datas desejadas e solicite um orçamento diretamente com o proprietário.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className="absolute -top-3 -right-3 bg-primary text-primary-foreground">3</Badge>
                  <CardTitle className="text-lg">Pague</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Efetue o pagamento de forma segura através da nossa plataforma com proteção total.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className="absolute -top-3 -right-3 bg-primary text-primary-foreground">4</Badge>
                  <CardTitle className="text-lg">Receba</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    O equipamento é entregue no local combinado, pronto para uso em sua obra.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Owners */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Para Proprietários</h2>
              <p className="text-lg text-muted-foreground">Monetize seus equipamentos de forma inteligente</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Cadastre seus Equipamentos</h3>
                    <p className="text-muted-foreground">
                      Adicione fotos, especificações e defina o preço dos seus equipamentos em poucos minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Receba Solicitações</h3>
                    <p className="text-muted-foreground">
                      Interessados entram em contato diretamente com você através da plataforma.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Aprove e Ganhe</h3>
                    <p className="text-muted-foreground">
                      Aprove as locações que fazem sentido para você e receba o pagamento de forma segura.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild size="lg">
                    <Link href="/cadastro">
                      Começar a Ganhar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/person-using-tablet-to-manage-construction-equipme.png"
                  alt="Pessoa gerenciando negócio de locação de equipamentos"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Security */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Segurança e Proteção</h2>
              <p className="text-lg text-muted-foreground">Sua tranquilidade é nossa prioridade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-4">Seguro Obrigatório</h3>
                  <p className="text-muted-foreground">
                    Todos os equipamentos possuem seguro contra danos, roubo e acidentes durante o período de locação.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-4">Usuários Verificados</h3>
                  <p className="text-muted-foreground">
                    Todos os usuários passam por processo de verificação de identidade e histórico antes de usar a
                    plataforma.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-4">Suporte 24/7</h3>
                  <p className="text-muted-foreground">
                    Nossa equipe está disponível 24 horas por dia para resolver qualquer problema ou dúvida.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Perguntas Frequentes</h2>
              <p className="text-lg text-muted-foreground">Tire suas dúvidas sobre como funciona a MaqExpress</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como funciona o pagamento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    O pagamento é processado de forma segura através da nossa plataforma. Aceitamos cartões de crédito,
                    débito e PIX. O valor só é liberado para o proprietário após a confirmação da entrega do
                    equipamento.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">E se o equipamento apresentar problemas?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Todos os equipamentos possuem seguro obrigatório. Em caso de problemas técnicos ou danos, nossa
                    equipe de suporte ajuda a resolver a situação rapidamente, incluindo substituição do equipamento se
                    necessário.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso cancelar uma locação?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim, você pode cancelar uma locação seguindo nossa política de cancelamento. Cancelamentos com mais
                    de 24 horas de antecedência têm reembolso total. Para cancelamentos de última hora, consulte os
                    termos específicos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como é feita a entrega dos equipamentos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A entrega é coordenada diretamente entre você e o proprietário do equipamento. Muitos proprietários
                    oferecem serviço de entrega e retirada no local da obra por uma taxa adicional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-balance mb-4">Pronto para Começar?</h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já descobriram a forma mais fácil de alugar equipamentos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/maquinas">
                  Buscar Equipamentos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/cadastro">Cadastrar Equipamentos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
