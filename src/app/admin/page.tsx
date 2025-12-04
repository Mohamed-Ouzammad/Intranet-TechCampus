"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, ROLE_LABELS, canAccess } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setRole(user.role);
    }
  }, [router]);

  if (!role) {
    return (
      <div className="text-sm text-gray-500">
        Chargement de l&apos;espace admin...
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[role];

  if (!canAccess(role, "admin")) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">Administration</h1>
        <p className="mt-2 text-sm text-red-600">
          Accès réservé aux administrateurs. Votre rôle actuel est :{" "}
          <span className="font-medium">{roleLabel}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Administration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gestion avancée du site, des utilisateurs et des établissements.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Gestion site vitrine / contenus */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold">
            Site vitrine & contenus
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Maquette d&apos;un back-office simple type blog / CMS.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Modifier la page de présentation de l&apos;école
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Gérer les formations (intitulés, descriptifs, visuels)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Créer / éditer des articles et les mettre en avant
            </li>
          </ul>
        </section>

        {/* Gestion utilisateurs & rôles */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold">
            Utilisateurs & rôles
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Création de comptes, attribution de rôles, gestion par
            établissement.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Créer un utilisateur (étudiant, intervenant, RP, assistant,
              admin)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Modifier rôle / réinitialiser mot de passe
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Assigner un utilisateur à une ou plusieurs écoles
            </li>
          </ul>
        </section>

        {/* Gestion des établissements */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold">
            Établissements & paramètres
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Vue multi-établissements (admin global) ou filtrée (admin local).
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Créer un nouvel établissement
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Configurer les paramètres (année scolaire, contacts, etc.)
            </li>
          </ul>
        </section>

        {/* Monitoring / logs */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold">Monitoring</h2>
          <p className="mb-3 text-xs text-gray-500">
            Statistiques d&apos;usage et surveillance technique (maquette).
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Utilisateurs actifs, volumétrie de documents
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Logs de connexion / sécurité
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Exports de rapports (PDF / Excel)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}


