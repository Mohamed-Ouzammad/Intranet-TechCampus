"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { canAccess, getCurrentUser, logout, Role } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour mettre à jour le rôle et l'email
    const updateUser = () => {
      const user = getCurrentUser();
      if (!user) {
        // Ne rediriger que si on n'est pas déjà sur la page de login
        if (pathname !== "/login") {
          router.push("/login");
        }
        setRole(null);
        setEmail(null);
      } else {
        setRole(user.role);
        setEmail(user.email);
      }
      setIsLoading(false);
    };

    // Charger l'utilisateur au montage et à chaque changement de route
    updateUser();

    // Écouter les changements d'authentification (événement personnalisé)
    const handleAuthChange = () => {
      updateUser();
    };

    // Écouter les changements de localStorage (pour les changements cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tc_current_user") {
        updateUser();
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Ne pas afficher le header sur la page de login
  if (pathname === "/login") return null;

  if (isLoading) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
            TC
          </span>
          <span className="font-semibold text-slate-800 select-none">
            Tech Campus — Intranet
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm text-gray-700">
          {canAccess(role, "dashboard") && (
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          )}
          {canAccess(role, "planning_view") && (
            <Link href="/planning" className="hover:text-blue-600">
              Planning
            </Link>
          )}
          {canAccess(role, "documents") && (
            <Link href="/documents" className="hover:text-blue-600">
              Documents
            </Link>
          )}
          {canAccess(role, "notes") && (
            <Link href="/notes" className="hover:text-blue-600">
              Notes
            </Link>
          )}
          {canAccess(role, "messages") && (
            <Link href="/messages" className="hover:text-blue-600">
              Messages
            </Link>
          )}
          {canAccess(role, "admin") && (
            <Link href="/admin" className="hover:text-blue-600">
              Admin
            </Link>
          )}
          {role && (
            <Link href="/profile" className="hover:text-blue-600">
              Profil
            </Link>
          )}
        </nav>

        {/* RIGHT : User + Logout */}
        <div className="flex items-center gap-4">
          {email && (
            <span className="text-xs text-gray-500">
              {email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-1.5 
              text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
