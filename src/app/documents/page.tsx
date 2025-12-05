"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, ROLE_LABELS, canAccess } from "@/lib/auth";

export default function DocumentsPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("CVEC");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setRole(user.role);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Remplacer par un vrai appel API
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", documentType);

      // Simule un délai d'upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(`Document "${selectedFile.name}" déposé avec succès ! (Simulation)`);
      setSelectedFile(null);
      // Reset le input file
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      alert("Erreur lors du dépôt du document");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!role) {
    return (
      <div className="text-sm text-gray-500">
        Chargement de la page documents...
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[role];

  const canValidate =
    canAccess(role, "documents_validation") || role === "admin";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Documents administratifs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Vue adaptée au rôle : <span className="font-medium">{roleLabel}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Étudiant / intervenant : dépôt de documents */}
        {(role === "etudiant" || role === "intervenant") &&
          canAccess(role, "documents_depots") && (
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Déposer un document
              </h2>
              <p className="mb-2 text-xs text-gray-500">
                Exemple : CVEC, justificatif de domicile, casier judiciaire,
                pièce d&apos;identité...
              </p>
              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">
                    Type de document
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                  >
                    <option value="CVEC">CVEC</option>
                    <option value="Justificatif de domicile">Justificatif de domicile</option>
                    <option value="Pièce d'identité">Pièce d&apos;identité</option>
                    <option value="Casier judiciaire">Casier judiciaire</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">
                    Fichier
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    className="text-xs cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  {selectedFile && (
                    <p className="mt-1 text-xs text-gray-600">
                      Fichier sélectionné : {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? "Dépôt en cours..." : "Déposer le document"}
                </button>
              </form>
            </section>
          )}

        {/* Tous : suivi de ses documents */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-900">
            Mes documents et statuts
          </h2>
          <p className="mb-2 text-xs text-gray-500">
            Liste d&apos;exemple à remplacer par des données réelles.
          </p>
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Type</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Statut</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Dernière MAJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-gray-600">
                <tr>
                  <td className="px-3 py-2">CVEC</td>
                  <td className="px-3 py-2">
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Validé
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    02/09/2024
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">
                    Justificatif de domicile
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      En attente
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    15/10/2024
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Assistant / RP / Admin : validation des documents */}
        {canValidate && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              Documents à valider
            </h2>
            <p className="mb-2 text-xs text-gray-500">
              Vue de travail pour assistant / responsable / admin.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2">
                <div>
                  <p className="font-medium">
                    Pièce d&apos;identité — Etudiant : L. Dupont
                  </p>
                  <p className="text-xs text-gray-500">
                    Déposé le 10/10/2024 • Urgent
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                    Valider
                  </button>
                  <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                    Refuser
                  </button>
                </div>
              </li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}


