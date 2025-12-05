"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role } from "@/lib/auth";

type ViewMode = "jour" | "semaine" | "mois";

const viewLabels: Record<ViewMode, string> = {
  jour: "Jour",
  semaine: "Semaine",
  mois: "Mois",
};

const ALL_PROMOS = ["A1", "A2", "B3", "InfoDev 1", "InfoDev 2", "InfoDev 3"];

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

  // --- Modal disponibilité ---
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

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
    } else if (
      user.role === "responsable_pedagogique" ||
      user.role === "admin"
    ) {
      setPromoList(ALL_PROMOS);
      setSelectedPromo(ALL_PROMOS[0]);
    }
  }, [router]);

  const coursFiltres =
    role === "etudiant"
      ? MOCK_COURS
      : MOCK_COURS.filter((c) => c.promo === selectedPromo);

  const isEtudiant = role === "etudiant";
  const isIntervenant = role === "intervenant";
  const isRP = role === "responsable_pedagogique";
  const isAdmin = role === "admin";

  // --- ENVOI DES DISPONIBILITES ---
  const handleSubmitAvailability = async () => {
    if (!selectedDate || !selectedHour) {
      alert("Merci de remplir la date et l'horaire.");
      return;
    }

    // simulation 1 seconde
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(
      `Votre disponibilité du ${selectedDate} à ${selectedHour} a bien été envoyée ! (Simulation)`
    );

    setShowModal(false);
    setSelectedDate("");
    setSelectedHour("");
  };

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

      {/* LISTE CLASSES */}
      {(isIntervenant || isRP || isAdmin) && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">
            Sélection de la classe
          </h2>

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

      {/* ACTIONS SPÉCIFIQUES */}
      <section className="flex justify-end gap-3">
        {isIntervenant && (
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
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
            Vue {viewLabels[viewMode]} –{" "}
            {isEtudiant ? "Votre planning" : selectedPromo}
          </h2>
          <span className="text-xs text-gray-500">Maquette statique</span>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-gray-900">
          {coursFiltres.map((cours) => (
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

          {coursFiltres.length === 0 && (
            <p className="col-span-full text-sm text-gray-500">
              Aucun cours pour cette classe.
            </p>
          )}
        </div>
      </section>

      {/* ----------- MODAL DISPONIBILITES ----------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une disponibilité
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Horaire</label>
                <input
                  type="time"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>

                <button
                  onClick={handleSubmitAvailability}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------------------- */}
    </div>
  );
}