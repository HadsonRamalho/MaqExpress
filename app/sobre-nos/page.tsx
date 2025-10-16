import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Users, Shield, Award, Target, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Sobre a MaqExpress</h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
              Conectamos pessoas e equipamentos para construir o futuro. Somos a plataforma líder em locação de máquinas
              e equipamentos no Brasil.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Nossa Missão</h3>
                  <p className="text-muted-foreground">
                    Democratizar o acesso a equipamentos de qualidade, facilitando a locação e promovendo o crescimento
                    sustentável da construção civil no Brasil.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Nossos Valores</h3>
                  <p className="text-muted-foreground">
                    Transparência, confiabilidade e inovação guiam todas as nossas decisões. Priorizamos relacionamentos
                    duradouros baseados na confiança mútua.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Nossa Visão</h3>
                  <p className="text-muted-foreground">
                    Ser a principal plataforma de locação de equipamentos da América Latina, transformando a forma como
                    as pessoas acessam máquinas e ferramentas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-balance mb-4">Nossa História</h2>
                <p className="text-lg text-muted-foreground">
                  Fundada em 2020, a MaqExpress nasceu da necessidade de simplificar o acesso a equipamentos de
                  construção
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">O Início</h3>
                    <p className="text-muted-foreground">
                      Tudo começou quando nossos fundadores, engenheiros com mais de 15 anos de experiência na
                      construção civil, perceberam a dificuldade que pequenas e médias empresas enfrentavam para acessar
                      equipamentos de qualidade.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">A Solução</h3>
                    <p className="text-muted-foreground">
                      Criamos uma plataforma digital que conecta proprietários de equipamentos com quem precisa
                      alugá-los, eliminando intermediários e reduzindo custos para ambas as partes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Hoje</h3>
                    <p className="text-muted-foreground">
                      Somos a plataforma de confiança de milhares de usuários em todo o Brasil, com mais de 10.000
                      equipamentos cadastrados e centenas de locações realizadas mensalmente.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="/construction-site.png"
                    alt="Canteiro de obras com máquinas pesadas"
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">MaqExpress em Números</h2>
              <p className="text-lg text-muted-foreground">Resultados que comprovam nossa excelência</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10.000+</div>
                <div className="text-muted-foreground">Equipamentos Cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5.000+</div>
                <div className="text-muted-foreground">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50.000+</div>
                <div className="text-muted-foreground">Locações Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                <div className="text-muted-foreground">Avaliação Média</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Nossa Equipe</h2>
              <p className="text-lg text-muted-foreground">
                Profissionais experientes dedicados a revolucionar o mercado de locação de equipamentos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Carlos Silva</h3>
                  <Badge variant="secondary" className="mb-3">
                    CEO & Fundador
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Engenheiro Civil com 20 anos de experiência em grandes obras de infraestrutura.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ana Santos</h3>
                  <Badge variant="secondary" className="mb-3">
                    CTO
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Especialista em tecnologia com foco em plataformas digitais e experiência do usuário.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Roberto Lima</h3>
                  <Badge variant="secondary" className="mb-3">
                    Diretor Comercial
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Especialista em desenvolvimento de negócios e relacionamento com clientes corporativos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-balance mb-4">Por Que Escolher a MaqExpress?</h2>
              <p className="text-lg text-muted-foreground">Os diferenciais que nos tornam únicos no mercado</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Segurança Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Todos os equipamentos são verificados e possuem seguro obrigatório incluído.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Wrench className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Qualidade Garantida</h3>
                  <p className="text-sm text-muted-foreground">
                    Equipamentos revisados e em perfeito estado de funcionamento.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Suporte 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Equipe especializada disponível para ajudar quando você precisar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Melhor Preço</h3>
                  <p className="text-sm text-muted-foreground">Preços competitivos sem taxas ocultas ou surpresas.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
