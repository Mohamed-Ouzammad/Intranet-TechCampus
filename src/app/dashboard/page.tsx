"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role } from "@/lib/auth";

export default function DashboardPage() {
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
        Chargement de votre tableau de bord...
      </div>
    );
  }

  const isEtudiant = role === "etudiant";
  const isIntervenant = role === "intervenant";
  const isAssistant = role === "assistant_pedagogique";
  const isResponsable = role === "responsable_pedagogique";
  const isAdmin = role === "admin";

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tableau de bord{" "}
          <span className="text-blue-600">
            {isEtudiant && "Étudiant"}
            {isIntervenant && "Intervenant"}
            {isAssistant && "Assistant pédagogique"}
            {isResponsable && "Responsable pédagogique"}
            {isAdmin && "Admin"}
          </span>
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Accédez rapidement à vos informations clés.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Planning du jour – visible pour tous */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Planning du jour</h2>
          </header>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              <strong>08:30–10:00</strong> — Algorithmique (Salle B201)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              <strong>10:15–12:00</strong> — Dev Web — TP Tailwind (Salle D101)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              <strong>14:00–17:00</strong> — Projet de groupe — Sprint 2
            </li>
          </ul>
        </section>

        {/* Bloc spécifique selon le rôle */}
        {isEtudiant && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Dernières notes</h2>
            </header>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Matière</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Évaluation
                    </th>
                    <th className="px-3 py-2 text-left font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="px-3 py-2">Dev Web</td>
                    <td className="px-3 py-2">TP Tailwind</td>
                    <td className="px-3 py-2">
                      <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                        16/20
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">BDD</td>
                    <td className="px-3 py-2">Contrôle</td>
                    <td className="px-3 py-2">
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-700">
                        12/20
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {isIntervenant && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Supports à publier / classes
              </h2>
            </header>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Cours React — Chapitre 3 (à relire)
              </li>
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Sujet TP : API REST (à mettre en ligne)
              </li>
            </ul>
          </section>
        )}

        {isAssistant && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Dossiers à traiter (assistant pédagogique)
              </h2>
            </header>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Justificatif de stage — 3 étudiants en attente
              </li>
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Conventions d&apos;alternance à vérifier
              </li>
            </ul>
          </section>
        )}

        {isAdmin && (
          <section className="rounded-xl border bg-amber-50 p-5 text-amber-900 shadow-sm">
            <h2 className="mb-2 text-base font-semibold">
              Vue admin / supervision
            </h2>
            <p className="text-sm">
              Accès aux consoles d&apos;administration, supervision des rôles et
              des droits. (À connecter plus tard au backend.)
            </p>
          </section>
        )}

        {/* Bloc commun : documents récents */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Documents récents</h2>
          </header>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Charte informatique (PDF)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Planning examens S1 (PDF)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}


