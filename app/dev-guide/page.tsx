"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, ExternalLink, Settings, Shield, Zap } from "lucide-react"

export default function DevGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Guia do Desenvolvedor</h1>
            <Badge variant="secondary">Desenvolvimento</Badge>
          </div>
          <p className="text-muted-foreground">Instruções completas para integração com Google OAuth no MaqExpress</p>
        </div>

        <div className="space-y-6">
          {/* Configuração Inicial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                1. Configuração Inicial do Google Cloud Console
              </CardTitle>
              <CardDescription>Configure o projeto no Google Cloud Platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Passos:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Acesse o{" "}
                    <a
                      href="https://console.cloud.google.com"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Google Cloud Console <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Ative a Google+ API e Google OAuth2 API</li>
                  <li>Vá para "Credenciais" → "Criar credenciais" → "ID do cliente OAuth 2.0"</li>
                  <li>Configure as origens JavaScript autorizadas:</li>
                </ol>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    http://localhost:3000 (desenvolvimento)
                    <br />
                    https://maqexpress.vercel.app (produção)
                  </code>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm" start={6}>
                  <li>Configure os URIs de redirecionamento autorizados:</li>
                </ol>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    http://localhost:3000/api/auth/callback/google
                    <br />
                    https://maqexpress.vercel.app/api/auth/callback/google
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instalação de Dependências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                2. Instalação e Configuração do NextAuth.js
              </CardTitle>
              <CardDescription>Configure a autenticação no projeto Next.js</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Instalar dependências:</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    npm install next-auth
                    <br />
                    npm install @next-auth/prisma-adapter prisma @prisma/client
                  </code>
                </div>

                <h4 className="font-semibold">Variáveis de ambiente (.env.local):</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    NEXTAUTH_URL=http://localhost:3000
                    <br />
                    NEXTAUTH_SECRET=seu-secret-super-seguro
                    <br />
                    GOOGLE_CLIENT_ID=seu-google-client-id
                    <br />
                    GOOGLE_CLIENT_SECRET=seu-google-client-secret
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração da API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                3. Configuração da API Route
              </CardTitle>
              <CardDescription>Crie o arquivo de configuração do NextAuth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Criar: app/api/auth/[...nextauth]/route.ts</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  }
})

export { handler as GET, handler as POST }`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                4. Configuração do Provider
              </CardTitle>
              <CardDescription>Configure o SessionProvider no layout da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Atualizar: app/layout.tsx</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementação nos Componentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                5. Implementação nos Componentes
              </CardTitle>
              <CardDescription>Adicione o botão de login com Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Atualizar: components/auth/login-form.tsx</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`import { signIn } from 'next-auth/react'

// Adicionar no formulário de login:
<Button
  type="button"
  variant="outline"
  className="w-full bg-transparent"
  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
>
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    {/* Google Icon SVG */}
  </svg>
  Continuar com Google
</Button>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deploy em Produção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                6. Deploy em Produção
              </CardTitle>
              <CardDescription>Configurações para ambiente de produção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Vercel Environment Variables:</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    NEXTAUTH_URL=https://maqexpress.vercel.app
                    <br />
                    NEXTAUTH_SECRET=production-secret-key
                    <br />
                    GOOGLE_CLIENT_ID=production-client-id
                    <br />
                    GOOGLE_CLIENT_SECRET=production-client-secret
                  </code>
                </div>

                <h4 className="font-semibold">Atualizar Google Cloud Console:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Adicionar domínio de produção nas origens autorizadas</li>
                  <li>Configurar política de privacidade e termos de uso</li>
                  <li>Solicitar verificação do app (se necessário)</li>
                  <li>Configurar tela de consentimento OAuth</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Notas Importantes */}
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">⚠️ Notas Importantes</CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Esta página é apenas para desenvolvimento e não deve ser publicada</li>
                <li>Mantenha as credenciais do Google sempre seguras</li>
                <li>Teste a integração em ambiente local antes do deploy</li>
                <li>Configure adequadamente a tela de consentimento OAuth</li>
                <li>Monitore os logs de autenticação para identificar problemas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
