import Link from "next/link"
import { Wrench, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-2xl mb-4">
              <Wrench className="h-6 w-6" />
              MAQEXPRESS
            </div>
            <p className="text-primary-foreground/80 max-w-md">
              Conectando pessoas e equipamentos para construir o futuro. Locação de máquinas e equipamentos com
              segurança e praticidade.
            </p>
          </div>

          {/* Institutional Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">INSTITUCIONAL</h3>
            <div className="space-y-2">
              <Link
                href="/sobre-nos"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Sobre nós
              </Link>
              <Link
                href="/"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Página inicial
              </Link>
              <Link
                href="/como-funciona"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Como funciona
              </Link>
              <Link
                href="/maquinas"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Máquinas
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">FALE CONOSCO</h3>
            <div className="space-y-3">
              <div className="text-primary-foreground/80">Central de Ajuda</div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contato@maqexpress.com</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(33)1234-5678</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 MaqExpress. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
