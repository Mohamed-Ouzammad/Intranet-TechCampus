import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/layout/Header";

export const metadata: Metadata = {
  title: "Intranet Tech Campus",
  description: "Intranet interne",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
