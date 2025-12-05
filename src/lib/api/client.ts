import { getToken } from "@/lib/auth";
import {
  ApiClass,
  ApiDocument,
  ApiNote,
  ApiPlanningSlot,
  StudentNoteView,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://back-intra.onrender.com";

/**
 * Appel générique à l'API Techcampus.
 * - Ajoute automatiquement le token JWT si présent en localStorage.
 * - Lance une Error si la réponse n'est pas OK.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers ?? {});

  // JSON par défaut si body présent
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Auth: Bearer <token>
  //const token = getToken();
  //if (token) {
   // headers.set("Authorization", `Bearer ${token}`);
  //}

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Erreur API (${response.status})`;
    try {
      const data = await response.json();
      if (data && typeof data === "object" && "message" in data) {
        message = (data as any).message as string;
      }
    } catch {
      // ignore JSON parse error, keep generic message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    // Pas de contenu
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Planning d'un étudiant.
 */
export function fetchStudentPlanning(
  studentUserId: number
): Promise<ApiPlanningSlot[]> {
  return apiFetch<ApiPlanningSlot[]>(`/planning/student/${studentUserId}`, {
    method: "GET",
  });
}

/**
 * Planning d'un enseignant.
 */
export function fetchTeacherPlanning(
  teacherUserId: number
): Promise<ApiPlanningSlot[]> {
  return apiFetch<ApiPlanningSlot[]>(`/planning/teacher/${teacherUserId}`, {
    method: "GET",
  });
}

/**
 * Planning global (utilisé pour admin / responsable / assistant).
 */
export function fetchAllPlanning(): Promise<ApiPlanningSlot[]> {
  return apiFetch<ApiPlanningSlot[]>("/planning", {
    method: "GET",
  });
}

/**
 * Documents en attente de validation (admin / responsable_pedagogique).
 */
export function fetchPendingDocuments(): Promise<ApiDocument[]> {
  return apiFetch<ApiDocument[]>("/documents/pending", {
    method: "GET",
  });
}

/**
 * Vue "Dernières notes" pour un étudiant :
 * - Récupère toutes les notes et toutes les classes
 * - Filtre sur l'étudiant
 * - Map en vue simplifiée
 */
export async function fetchStudentNotesView(
  studentUserId: number
): Promise<StudentNoteView[]> {
  const [notes, classes] = await Promise.all([
    apiFetch<ApiNote[]>(`/notes/student/${studentUserId}`, { method: "GET" }),
    apiFetch<ApiClass[]>("/classes", { method: "GET" }),
  ]);

  const classLabelById = new Map<number, string>(
    classes.map((c) => [c.id, c.label])
  );

  const views: StudentNoteView[] = notes.map((note) => {
    const rawValue = note.value;
    const rawEcts = note.ects;

    const numericValue =
      typeof rawValue === "string" ? parseFloat(rawValue) : rawValue;

    const numericEcts =
      typeof rawEcts === "string" ? parseFloat(rawEcts) : rawEcts;

    return {
      classLabel:
        note.class_id != null
          ? classLabelById.get(note.class_id) ?? `Classe #${note.class_id}`
          : "Classe inconnue",
      value: numericValue,
      ects: numericEcts,
    };
  });

  return views.slice(0, 5);
}