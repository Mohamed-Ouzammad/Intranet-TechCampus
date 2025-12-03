"use client";

import "./globals.css";
import { logout, getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState(null as any);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f8fafc] text-gray-900">
        {/* Header global */}
        <header className="w-full bg-white border-b shadow-sm">
          <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3 select-none">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <span className="text-sm font-bold">TC</span>
              </span>
              <span className="text-base font-semibold text-slate-800">
                Tech Campus — Intranet
              </span>
            </div>

            {user && (
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </header>

        {/* Zone de contenu */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
