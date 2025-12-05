"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, User } from "@/lib/auth";
import type { ApiPlanningSlot, StudentNoteView } from "@/lib/api/types";
import {
  fetchAllPlanning,
  fetchPendingDocuments,
  fetchStudentNotesView,
  fetchStudentPlanning,
  fetchTeacherPlanning,
} from "@/lib/api/client";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const [planning, setPlanning] = useState<ApiPlanningSlot[]>([]);
  const [studentNotes, setStudentNotes] = useState<StudentNoteView[]>([]);
  const [pendingDocumentsCount, setPendingDocumentsCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1) Récupérer l'utilisateur courant (depuis localStorage, via ton getCurrentUser existant)
  useEffect(() => {
    const current = getCurrentUser();

    if (!current) {
      router.push("/login");
      return;
    }

    setUser(current);
    setRole(current.role);
  }, [router]);

  // 2) Charger les données dès qu'on a user + rôle
  useEffect(() => {
    if (!user || !role) return;

    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    const userId = Number(user.id);

    async function loadDashboard() {
      try {
        // Planning selon le rôle
        let planningSlots: ApiPlanningSlot[] = [];

        if (role === "etudiant") {
          planningSlots = await fetchStudentPlanning(userId);
        } else if (role === "intervenant") {
          planningSlots = await fetchTeacherPlanning(userId);
        } else {
          // admin / responsable / assistant → planning global
          planningSlots = await fetchAllPlanning();
        }

        // Notes étudiant
        let notesView: StudentNoteView[] = [];
        if (role === "etudiant") {
          notesView = await fetchStudentNotesView(userId);
        }

        // Documents en attente (admin / responsable_pedagogique)
        let pendingCount = 0;
        if (role === "admin" || role === "responsable_pedagogique") {
          const docs = await fetchPendingDocuments();
          pendingCount = docs.length;
        }

        if (cancelled) return;

        setPlanning(planningSlots);
        setStudentNotes(notesView);
        setPendingDocumentsCount(pendingCount);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setErrorMessage(
            "Impossible de charger vos données pour l’instant. Veuillez réessayer plus tard."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user, role]);

  // 3) Slots du jour
const todaySlots = useMemo(() => {
  if (!planning.length) return [];

  const todayIsoDate = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  return planning.filter((slot) => {
    // slot.date = "2025-12-05T00:00:00.000Z" → on garde juste la partie date
    const slotDatePart = slot.date.slice(0, 10);
    return slotDatePart === todayIsoDate;
  });
}, [planning]);


  const isEtudiant = role === "etudiant";
  const isIntervenant = role === "intervenant";
  const isAssistant = role === "assistant_pedagogique";
  const isResponsable = role === "responsable_pedagogique";
  const isAdmin = role === "admin";

  // 4) États globaux
  if (!user || !role) {
    return (
      <div className="text-sm text-gray-500">
        Chargement de votre tableau de bord...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {errorMessage}
      </div>
    );
  }

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
            <h2 className="text-base font-semibold text-gray-900">
              Planning du jour
            </h2>
            {isLoading && (
              <span className="text-xs text-gray-400">Chargement...</span>
            )}
          </header>

          {!isLoading && todaySlots.length === 0 && (
            <p className="text-sm text-slate-500">
              Aucun créneau prévu pour aujourd&apos;hui.
            </p>
          )}

<ul className="space-y-2 text-sm text-slate-700">
  {todaySlots.map((slot) => {
    const start = slot.start_time.slice(0, 5); // "08:30"
    const end = slot.end_time.slice(0, 5);     // "10:00"
    return (
      <li
        key={slot.slot_id}
        className="rounded-lg border bg-slate-50 px-3 py-2"
      >
        <strong>
          {start}–{end}
        </strong>{" "}
        — {slot.course_label} ({slot.room}){" "}
        <span className="text-xs text-slate-500">
          — {slot.class_label}
        </span>
      </li>
    );
  })}
</ul>
          </section>

        {/* Bloc spécifique selon le rôle */}
        {isEtudiant && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Dernières notes
              </h2>
              {isLoading && (
                <span className="text-xs text-gray-400">Chargement...</span>
              )}
            </header>

            {!isLoading && studentNotes.length === 0 && (
              <p className="text-sm text-slate-500">
                Aucune note enregistrée pour le moment.
              </p>
            )}

            {studentNotes.length > 0 && (
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        Matière
                      </th>
                      <th className="px-3 py-2 text-left font-medium">Note</th>
                      <th className="px-3 py-2 text-left font-medium">ECTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {studentNotes.map((note, index) => (
                      <tr key={`${note.classLabel}-${index}`}>
                        <td className="px-3 py-2">{note.classLabel}</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                            {note.value.toFixed(2)}/20
                          </span>
                        </td>
                        <td className="px-3 py-2">{note.ects}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {isIntervenant && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Prochains créneaux (intervenant)
              </h2>
              {isLoading && (
                <span className="text-xs text-gray-400">Chargement...</span>
              )}
            </header>

            {!isLoading && planning.length === 0 && (
              <p className="text-sm text-slate-500">
                Aucun créneau à venir pour le moment.
              </p>
            )}

            <ul className="space-y-2 text-sm text-slate-700">
  {planning.slice(0, 5).map((slot) => {
    const dateLabel = new Date(slot.date).toLocaleDateString("fr-FR");
    const start = slot.start_time.slice(0, 5);
    const end = slot.end_time.slice(0, 5);

    return (
      <li
        key={slot.slot_id}
        className="rounded-lg border bg-slate-50 px-3 py-2"
      >
        <div className="font-medium">
          {dateLabel} — {start}–{end}
        </div>
        <div>
          {slot.course_label} ({slot.room}) —{" "}
          <span className="text-xs text-slate-500">
            {slot.class_label}
          </span>
        </div>
      </li>
    );
  })}
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
            {/* Future: brancher un endpoint spécifique si tu l'ajoutes */}
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Justificatifs de stage — (exemple statique)
              </li>
              <li className="rounded-lg border bg-slate-50 px-3 py-2">
                Conventions d&apos;alternance à vérifier — (exemple statique)
              </li>
            </ul>
          </section>
        )}

        {isAdmin && (
          <section className="rounded-xl border bg-amber-50 p-5 text-amber-900 shadow-sm">
            <h2 className="mb-2 text-base font-semibold">
              Vue admin / supervision
            </h2>
            <p className="mb-2 text-sm">
              Accès aux consoles d&apos;administration, supervision des rôles et
              des droits.
            </p>
            <p className="text-sm">
              Documents en attente de validation :{" "}
              <span className="font-semibold">
                {pendingDocumentsCount}
              </span>
            </p>
          </section>
        )}

        {isResponsable && (
          <section className="rounded-xl border bg-amber-50 p-5 text-amber-900 shadow-sm">
            <h2 className="mb-2 text-base font-semibold">
              Vue responsable pédagogique
            </h2>
            <p className="text-sm mb-1">
              Suivi global des plannings et des validations de documents.
            </p>
            <p className="text-sm">
              Documents en attente de validation :{" "}
              <span className="font-semibold">
                {pendingDocumentsCount}
              </span>
            </p>
          </section>
        )}

        {/* Bloc commun : documents récents (placeholder pour l’instant) */}
        <section className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Documents récents
            </h2>
            {/* Future: quand tu auras un GET /documents pour l'utilisateur courant */}
          </header>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Charte informatique (exemple statique)
            </li>
            <li className="rounded-lg border bg-slate-50 px-3 py-2">
              Planning examens S1 (exemple statique)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}