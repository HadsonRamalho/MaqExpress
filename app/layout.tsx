import { Hanken_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";

const sans = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-sans-hanken",
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "MaqExpress — Aluguel de máquinas e equipamentos",
	description:
		"Alugue a máquina certa para sua obra, direto com quem tem. Busca simples, contrato digital e pagamento seguro.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={`${sans.variable} font-sans antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>{children}</AuthProvider>
					<Toaster richColors position="top-center" />
				</ThemeProvider>
			</body>
		</html>
	);
}
