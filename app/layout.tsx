import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/hooks/auth";
import { Toaster } from "sonner";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
	title: "MaqExpress - Locação de Máquinas e Equipamentos",
	description:
		"Encontre a máquina ideal para sua obra. Locação de equipamentos com segurança e sem burocracia.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
					<NavBar/>
					{children}
					</AuthProvider>
					<Toaster richColors={true} />
				</ThemeProvider>
			</body>
		</html>
	);
}
