export type Role =
  | "etudiant"
  | "intervenant"
  | "assistant_pedagogique"
  | "responsable_pedagogique"
  | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type FeatureKey =
  // Navigation principale
  | "dashboard"
  | "planning_view"
  | "documents"
  | "notes"
  | "messages"
  | "admin"
  // Fonctions métier
  | "notes_consultation"
  | "notes_saisie"
  | "notes_validation"
  | "notes_modif_apres_validation"
  | "cours_consultation"
  | "cours_gestion"
  | "documents_depots"
  | "documents_validation"
  | "messagerie"
  | "planning_gestion"
  | "absences_gestion"
  | "utilisateurs_gestion"
  | "ecoles_gestion";

const STORAGE_KEY = "tc_current_user";

export const ROLE_PERMISSIONS: Record<Role, FeatureKey[]> = {
  // Étudiant :
  // - Consulter ses notes
  // - Accéder aux cours & documents
  // - Gérer ses documents administratifs / renouvellements
  // - Contacter intervenant / responsable (messagerie)
  // - Voir son planning
  etudiant: [
    "dashboard",
    "planning_view",
    "documents",
    "notes",
    "messages",
    "notes_consultation",
    "cours_consultation",
    "documents_depots",
    "messagerie",
  ],

  // Intervenant :
  // - Consulter ses cours
  // - Déposer des fichiers & supports
  // - Noter les étudiants
  // - Contacter étudiants / responsables
  intervenant: [
    "dashboard",
    "planning_view",
    "documents",
    "notes",
    "messages",
    "cours_consultation",
    "documents_depots",
    "notes_saisie",
    "messagerie",
  ],

  // Assistant pédagogique :
  // - Modifier les notes après validation
  // - Valider / vérifier documents (casier, identité, etc.)
  // - Vérifier infos étudiants / intervenants
  // - Peut être assigné à plusieurs écoles (géré côté données)
  assistant_pedagogique: [
    "dashboard",
    "planning_view",
    "documents",
    "notes",
    "messages",
    "notes_modif_apres_validation",
    "documents_validation",
    "messagerie",
  ],

  // Responsable pédagogique :
  // - Créer / gérer les cours
  // - Déposer des documents
  // - Gérer les absences (Edusign, etc.)
  // - Valider les notes
  // - Communiquer avec intervenants & étudiants
  responsable_pedagogique: [
    "dashboard",
    "planning_view",
    "documents",
    "notes",
    "messages",
    "cours_consultation",
    "cours_gestion",
    "documents_depots",
    "absences_gestion",
    "notes_validation",
    "messagerie",
  ],

  // Admin (local ou global, selon ton backend) :
  // - Gestion complète : utilisateurs, rôles, écoles, etc.
  admin: [
    "dashboard",
    "planning_view",
    "documents",
    "notes",
    "messages",
    "admin",
    "cours_consultation",
    "cours_gestion",
    "documents_depots",
    "documents_validation",
    "notes_consultation",
    "notes_saisie",
    "notes_validation",
    "notes_modif_apres_validation",
    "absences_gestion",
    "utilisateurs_gestion",
    "ecoles_gestion",
    "messagerie",
  ],
};

export function canAccess(role: Role | null, feature: FeatureKey): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(feature);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

// Mock d'authentification : en vrai, on appellerait le backend ici.
export async function login(email: string, _password: string): Promise<User> {
  // Simule un délai réseau
  await new Promise((res) => setTimeout(res, 400));

  if (!email.includes("@")) {
    throw new Error("Identifiants invalides");
  }

  let role: Role = "etudiant";
  const lower = email.toLowerCase();
  if (lower.includes("admin")) role = "admin";
  else if (lower.includes("intervenant") || lower.includes("prof")) role = "intervenant";
  else if (lower.includes("assist")) role = "assistant_pedagogique";
  else if (
    lower.includes("responsable") ||
    lower.includes("rp") ||
    lower.includes("pedagog")
  )
    role = "responsable_pedagogique";

  const user: User = {
    id: "u-" + Math.random().toString(36).slice(2, 8),
    email,
    role,
  };

  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}




