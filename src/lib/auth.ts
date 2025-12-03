export type Role = "etudiant" | "enseignant" | "staff" | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type FeatureKey =
  | "dashboard"
  | "planning_view"
  | "planning_edit"
  | "documents"
  | "notes"
  | "messages"
  | "admin";

const STORAGE_KEY = "tc_current_user";

export const ROLE_PERMISSIONS: Record<Role, FeatureKey[]> = {
  etudiant: ["dashboard", "planning_view", "documents", "notes", "messages"],
  enseignant: ["dashboard", "planning_view", "documents", "notes", "messages"],
  staff: [
    "dashboard",
    "planning_view",
    "planning_edit",
    "documents",
    "notes",
    "messages",
  ],
  admin: [
    "dashboard",
    "planning_view",
    "planning_edit",
    "documents",
    "notes",
    "messages",
    "admin",
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
  else if (lower.includes("staff") || lower.includes("assist")) role = "staff";
  else if (lower.includes("prof") || lower.includes("enseign")) role = "enseignant";

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




