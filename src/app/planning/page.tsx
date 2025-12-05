"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccess, getCurrentUser, Role } from "@/lib/auth";

type ViewMode = "jour" | "semaine" | "mois";

const viewLabels: Record<ViewMode, string> = {
  jour: "Jour",
  semaine: "Semaine",
  mois: "Mois",
};

// Liste fictive des promotions (intervenant = ses classes / RP = toutes)
const ALL_PROMOS = ["A1", "A2", "B3", "InfoDev 1", "InfoDev 2", "InfoDev 3"];

// Maquette temporaire avant connexion API
const MOCK_COURS = [
  {
    id: 1,
    titre: "Algo",
    promo: "InfoDev 3",
    enseignant: "M. Dupont",
    salle: "B201",
    horaire: "08:30–10:00",
  },
  {
    id: 2,
    titre: "Dev Web",
    promo: "InfoDev 3",
    enseignant: "Mme Martin",
    salle: "D101",
    horaire: "10:15–12:00",
  },
];

export default function PlanningPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("semaine");

  const [promoList, setPromoList] = useState<string[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>("");

  const intervenantPromos = ["InfoDev 3", "A1"];

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    setRole(user.role);

    if (user.role === "etudiant") {
      setPromoList([]); 
    } else if (user.role === "intervenant") {
      setPromoList(intervenantPromos);
      setSelectedPromo(intervenantPromos[0]);
    } else if (user.role === "responsable_pedagogique" || user.role === "admin") {
      setPromoList(ALL_PROMOS);
      setSelectedPromo(ALL_PROMOS[0]);
    }
  }, [router]);

  // Filtres appliqués seulement si Intervenant ou RP/Admin
  const coursFiltrés =
    role === "etudiant"
      ? MOCK_COURS // plus tard : filtre par promo de l'étudiant
      : MOCK_COURS.filter((c) => c.promo === selectedPromo);

  const isEtudiant = role === "etudiant";
  const isIntervenant = role === "intervenant";
  const isRP = role === "responsable_pedagogique";
  const isAdmin = role === "admin";

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Planning</h1>
          <p className="mt-1 text-sm text-gray-600">
            Consultez les séances par jour, semaine ou mois.
          </p>
        </div>

        {/* Vue jour/semaine/mois */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-xs font-medium text-gray-700">
          {(Object.keys(viewLabels) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-md px-3 py-1 ${
                viewMode === mode ? "bg-blue-600 text-white" : "hover:bg-gray-50"
              }`}
            >
              {viewLabels[mode]}
            </button>
          ))}
        </div>
      </header>

      {/* FILTRES PAR CLASSE */}
      {(isIntervenant || isRP || isAdmin) && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">Sélection de la classe</h2>

          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
          >
            {promoList.map((promo) => (
              <option key={promo} value={promo}>
                {promo}
              </option>
            ))}
          </select>
        </section>
      )}

      {/* ACTIONS SPÉCIFIQUES AU RÔLE */}
      <section className="flex justify-end">
        {isIntervenant && (
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Mes disponibilités
          </button>
        )}

        {(isRP || isAdmin) && (
          <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            Ajouter un cours
          </button>
        )}
      </section>

      {/* PLANNING */}
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Vue {viewLabels[viewMode]} – {isEtudiant ? "Votre planning" : selectedPromo}
          </h2>
          <span className="text-xs text-gray-500">Maquette statique</span>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-gray-900">
          {coursFiltrés.map((cours) => (
            <article
              key={cours.id}
              className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-gray-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{cours.titre}</h3>
                <span className="text-xs text-gray-700">{cours.horaire}</span>
              </div>
              <p className="text-xs text-gray-700">
                {cours.enseignant} • Salle {cours.salle}
              </p>
            </article>
          ))}

          {coursFiltrés.length === 0 && (
            <p className="col-span-full text-sm text-gray-500">
              Aucun cours pour cette classe.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
