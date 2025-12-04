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

/* ---------------------------------------------------
   🔐 VRAI LOGIN AVEC TON BACKEND
--------------------------------------------------- */
export async function login(email: string, password: string): Promise<User> {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Identifiants incorrects");
  }

  const data = await response.json();

  // FORMAT ATTENDU (exemple)
  // {
  //   "user": {
  //       "id": 11,
  //       "email": "momo@test.com",
  //       "role": "admin"
  //   },
  //   "token": "eyJhbGciOi..."
  // }

  if (!data.user || !data.token)
    throw new Error("Réponse invalide du serveur");

  const user: User = {
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
  };

  setCurrentUser(user, data.token);

  return user;
}

/* ---------------------------------------------------
   🚪 LOGOUT
--------------------------------------------------- */
export function logout() {
  setCurrentUser(null);
}
