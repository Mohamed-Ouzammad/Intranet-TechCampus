"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccess, FeatureKey, getCurrentUser, Role } from "@/lib/auth";

type ViewMode = "jour" | "semaine" | "mois";

const viewLabels: Record<ViewMode, string> = {
  jour: "Jour",
  semaine: "Semaine",
  mois: "Mois",
};

const promotions = ["A1", "A2", "B3"];
const salles = ["B201", "D101", "Amphi"];

const MOCK_COURS = [
  {
    id: 1,
    titre: "Algo",
    promo: "A2",
    enseignant: "M. Dupont",
    salle: "B201",
    horaire: "08:30–10:00",
  },
  {
    id: 2,
    titre: "Dev Web",
    promo: "A2",
    enseignant: "Mme Martin",
    salle: "D101",
    horaire: "10:15–12:00",
  },
];

export default function PlanningPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("semaine");
  const [promoFilter, setPromoFilter] = useState<string>("toutes");
  const [salleFilter, setSalleFilter] = useState<string>("toutes");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setRole(user.role);
    }
  }, [router]);

  const filteredCours = MOCK_COURS.filter((c) => {
    if (promoFilter !== "toutes" && c.promo !== promoFilter) return false;
    if (salleFilter !== "toutes" && c.salle !== salleFilter) return false;
    return true;
  });

  const canEdit =
    role && canAccess(role, "planning_edit" as FeatureKey);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Planning</h1>
          <p className="mt-1 text-sm text-gray-600">
            Consultez les séances de cours par jour, semaine ou mois.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-xs font-medium text-gray-700">
          {(Object.keys(viewLabels) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-md px-3 py-1 ${
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {viewLabels[mode]}
            </button>
          ))}
        </div>
      </header>

      {/* Filtres */}
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">
          Filtres
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-600">Promo</span>
            <select
              value={promoFilter}
              onChange={(e) => setPromoFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs"
            >
              <option value="toutes">Toutes</option>
              {promotions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-600">Salle</span>
            <select
              value={salleFilter}
              onChange={(e) => setSalleFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs"
            >
              <option value="toutes">Toutes</option>
              {salles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Vue "calendrier" simplifiée */}
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Vue {viewLabels[viewMode]} (maquette statique)
          </h2>
          <span className="text-xs text-gray-500">
            À connecter plus tard à l&apos;API temps réel
          </span>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredCours.map((cours) => (
            <article
              key={cours.id}
              className="rounded-lg border bg-slate-50 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{cours.titre}</h3>
                <span className="text-xs text-gray-500">
                  {cours.horaire}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Promo {cours.promo} • {cours.enseignant} • Salle{" "}
                {cours.salle}
              </p>
            </article>
          ))}

          {filteredCours.length === 0 && (
            <p className="col-span-full text-sm text-gray-500">
              Aucun cours ne correspond aux filtres.
            </p>
          )}
        </div>
      </section>

      {/* Formulaire admin / staff */}
      {canEdit && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">
            Gérer le planning (admin / staff)
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Formulaire maquetté : à connecter ensuite à l&apos;API de
            planning (US 6).
          </p>
          <form className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Titre du cours
              </label>
              <input
                type="text"
                className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                placeholder="Ex : Dev Web – TP Tailwind"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Promo
              </label>
              <select className="rounded-md border border-gray-300 px-2 py-1.5 text-xs">
                {promotions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Enseignant
              </label>
              <input
                type="text"
                className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Salle
              </label>
              <select className="rounded-md border border-gray-300 px-2 py-1.5 text-xs">
                {salles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Date &amp; heure
              </label>
              <input
                type="datetime-local"
                className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Enregistrer la séance
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}


