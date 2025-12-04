export type Role =
  | "etudiant"
  | "intervenant"
  | "assistant_pedagogique"
  | "responsable_pedagogique"
  | "admin";

export type User = {
  id: string | number;
  email: string;
  role: Role;
};

export const ROLE_LABELS: Record<Role, string> = {
  etudiant: "Étudiant",
  intervenant: "Intervenant",
  assistant_pedagogique: "Assistant pédagogique",
  responsable_pedagogique: "Responsable pédagogique",
  admin: "Administrateur",
};

export type FeatureKey =
  | "dashboard"
  | "planning_view"
  | "documents"
  | "notes"
  | "messages"
  | "admin"
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
const TOKEN_KEY = "tc_token";

export const ROLE_PERMISSIONS: Record<Role, FeatureKey[]> = {
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
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setCurrentUser(user: User | null, token?: string) {
  if (typeof window === "undefined") return;

  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }
}

/**
 * Mappe les rôles du backend vers les rôles du frontend
 */
function mapBackendRoleToFrontendRole(backendRole: string): Role {
  const roleMap: Record<string, Role> = {
    student: "etudiant",
    teacher: "intervenant",
    responsable_pedagogique: "responsable_pedagogique",
    assistant_pedagogique: "assistant_pedagogique",
    admin: "admin",
    // Support des anciens noms si besoin
    etudiant: "etudiant",
    intervenant: "intervenant",
  };

  return roleMap[backendRole] || "etudiant"; // Par défaut étudiant si rôle inconnu
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Essayer de récupérer le message d'erreur du backend
      let errorMessage = "Identifiants incorrects";
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Si pas de JSON, utiliser le message par défaut
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Le backend peut renvoyer soit { user: {...}, token: "..." }
    // soit directement { id, email, role, token }
    let userData: any;
    let token: string | undefined;

    if (data.user) {
      // Format: { user: {...}, token: "..." }
      userData = data.user;
      token = data.token;
    } else if (data.id && data.email && data.role) {
      // Format: { id, email, role, token }
      userData = { id: data.id, email: data.email, role: data.role };
      token = data.token;
    } else {
      throw new Error("Format de réponse invalide du serveur");
    }

    if (!userData || !userData.email || !userData.role) {
      throw new Error("Données utilisateur manquantes dans la réponse");
    }

    // Mapper le rôle backend → frontend
    const frontendRole = mapBackendRoleToFrontendRole(userData.role);

    const user: User = {
      id: userData.id,
      email: userData.email,
      role: frontendRole,
    };

    setCurrentUser(user, token);

    return user;
  } catch (error) {
    // Re-lancer l'erreur pour que le composant puisse l'afficher
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur de connexion au serveur");
  }
}

export function logout() {
  setCurrentUser(null);
}
