"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, ROLE_LABELS, canAccess } from "@/lib/auth";

export default function MessagesPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setRole(user.role);
    }
  }, [router]);

  if (!role) {
    return (
      <div className="text-sm text-gray-500">
        Chargement de la messagerie...
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[role];

  if (!canAccess(role, "messagerie")) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">Messagerie interne</h1>
        <p className="mt-2 text-sm text-red-600">
          Vous n&apos;avez pas accès à ce module.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Messagerie interne</h1>
        <p className="mt-1 text-sm text-gray-600">
          Envoyez des messages aux interlocuteurs de votre établissement.
          <span className="ml-1 font-medium">{roleLabel}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px,1fr]">
        {/* Liste de conversations / contacts */}
        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">
            Conversations
          </h2>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700">
              Referent pédagogique
            </li>
            <li className="rounded-md px-3 py-2 hover:bg-gray-50">
              Intervenant — Dev Web
            </li>
            <li className="rounded-md px-3 py-2 hover:bg-gray-50">
              Assistant pédagogique
            </li>
          </ul>
        </aside>

        {/* Zone de messages */}
        <section className="flex flex-col rounded-xl border bg-white shadow-sm">
          <header className="border-b px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">
              Référent pédagogique
            </p>
            <p className="text-xs text-gray-500">
              Dernier message : il y a 2h
            </p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            <div className="w-fit max-w-[70%] rounded-lg bg-slate-100 px-3 py-2 text-gray-800">
              Bonjour, pensez à déposer vos justificatifs d&apos;absence avant
              vendredi.
            </div>
            <div className="ml-auto w-fit max-w-[70%] rounded-lg bg-blue-600 px-3 py-2 text-white">
              Bonjour, c&apos;est noté, merci !
            </div>
          </div>

          <form className="border-t p-3 text-sm">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Écrire un message (maquette, non connecté à un backend)..."
              />
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Envoyer
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}



