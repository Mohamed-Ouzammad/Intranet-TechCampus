"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, ROLE_LABELS, canAccess } from "@/lib/auth";

export default function NotesPage() {
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
        Chargement de la page notes...
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[role];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
        <p className="mt-1 text-sm text-gray-600">
          Vue adaptée au rôle : <span className="font-medium">{roleLabel}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Étudiant : visualisation de ses notes / ECTS / absences */}
        {role === "etudiant" && (
          <>
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Mes notes et ECTS
              </h2>
              <p className="mb-2 text-xs text-gray-500">
                Maquette statique, à connecter au backend plus tard.
              </p>
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Matière
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Note</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">ECTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-gray-600">
                    <tr>
                      <td className="px-3 py-2">Dev Web</td>
                      <td className="px-3 py-2">16/20</td>
                      <td className="px-3 py-2">6</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Base de données</td>
                      <td className="px-3 py-2">13/20</td>
                      <td className="px-3 py-2">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Mes absences
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="rounded-lg border bg-slate-50 px-3 py-2">
                  06/10 matin — Non justifiée
                </li>
                <li className="rounded-lg border bg-slate-50 px-3 py-2">
                  12/10 journée — Justifiée (certificat)
                </li>
              </ul>
            </section>
          </>
        )}

        {/* Intervenant : soumission des notes */}
        {role === "intervenant" && canAccess(role, "notes_saisie") && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              Saisie des notes (maquette)
            </h2>
            <p className="mb-2 text-xs text-gray-500">
              Sélectionnez un cours puis saisissez les notes des étudiants.
            </p>
            <form className="space-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Cours
                </label>
                <select className="rounded-md border border-gray-300 px-2 py-1.5 text-xs">
                  <option>Dev Web – A2</option>
                  <option>Algo – A2</option>
                </select>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  Étudiants (exemple)
                </p>
                <div className="flex items-center justify-between gap-3 border-b py-1 text-xs">
                  <span>Dupont Léa</span>
                  <input
                    type="number"
                    className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    placeholder="Note"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 py-1 text-xs">
                  <span>Martin Hugo</span>
                  <input
                    type="number"
                    className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    placeholder="Note"
                  />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Soumettre pour validation RP
              </button>
            </form>
          </section>
        )}

        {/* Responsable pédagogique : validation des notes */}
        {role === "responsable_pedagogique" &&
          canAccess(role, "notes_validation") && (
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Validation des notes
              </h2>
              <p className="mb-2 text-xs text-gray-500">
                Liste des lots de notes en attente de validation.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium">
                      Dev Web – A2 – Partiel 1
                    </p>
                    <p className="text-xs text-gray-500">
                      Intervenant : M. Dupont • 22 étudiants
                    </p>
                  </div>
                  <button className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                    Valider
                  </button>
                </li>
              </ul>
            </section>
          )}

        {/* Assistant pédagogique : modification exceptionnelle */}
        {role === "assistant_pedagogique" &&
          canAccess(role, "notes_modif_apres_validation") && (
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Modification exceptionnelle
              </h2>
              <p className="mb-2 text-xs text-gray-500">
                Modifiez une note déjà validée en justifiant la modification.
              </p>
              <form className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">
                    Étudiant
                  </label>
                  <input
                    type="text"
                    placeholder="Nom Prénom"
                    className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">
                    Note actuelle / nouvelle note
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Actuelle"
                      className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Nouvelle"
                      className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">
                    Justification
                  </label>
                  <textarea
                    className="min-h-[80px] rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                    placeholder="Ex : erreur de saisie, décision de jury..."
                  />
                </div>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Enregistrer la modification
                </button>
              </form>
            </section>
          )}
      </div>
    </div>
  );
}


