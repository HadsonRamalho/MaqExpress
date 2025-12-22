"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Wrench, MapPin, User, LogOut, Settings, Bell } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Wrench className="h-6 w-6" />
            MAQEXPRESS
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
              Página Inicial
            </Link>
            <Link href="/como-funciona" className="hover:text-primary-foreground/80 transition-colors">
              Como Funciona
            </Link>
            <Link href="/maquinas" className="hover:text-primary-foreground/80 transition-colors">
              Máquinas
            </Link>
            <Link href="/sobre-nos" className="hover:text-primary-foreground/80 transition-colors">
              Sobre Nós
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Sua Cidade</span>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.nome.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/minhas-maquinas" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Minhas Máquinas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notificacoes" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notificações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contratos" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Contratos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            )}

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
