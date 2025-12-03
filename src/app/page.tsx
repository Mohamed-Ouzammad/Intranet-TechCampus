export default function Home() {
  return (
    <>

      {/* Contenu Accueil (statique pour l’instant, sans changement de rôle ni de page) */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Actualités */}
          <aside className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Actualités de l&apos;école
            </h2>
            <div className="space-y-3">
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Portes ouvertes — 12 nov.</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Découvrez nos campus et échangez avec les équipes.
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Conférence IA Étique</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Tables rondes avec des pros de la data &amp; RGPD.
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Résultats Promo 2024</h3>
                <p className="mt-1 text-xs text-slate-600">Félicitations aux diplômés !</p>
              </article>
            </div>
          </aside>

          {/* Colonne centrale : tableau de bord élève simplifié */}
          <section className="lg:col-span-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Planning du jour */}
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Planning du jour</h3>
                </header>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    <strong>08:30–10:00</strong> — Algorithmique (Salle B201)
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    <strong>10:15–12:00</strong> — Dev Web — TP Tailwind (Salle D101)
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    <strong>14:00–17:00</strong> — Projet de groupe — Sprint 2
                  </li>
                </ul>
              </section>

              {/* Dernières notes */}
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Dernières notes</h3>
                </header>
                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Matière</th>
                        <th className="px-3 py-2 text-left font-medium">Évaluation</th>
                        <th className="px-3 py-2 text-left font-medium">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="px-3 py-2">Dev Web</td>
                        <td className="px-3 py-2">TP Tailwind</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                            16/20
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">BDD</td>
                        <td className="px-3 py-2">Contrôle</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-700">
                            12/20
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Algo</td>
                        <td className="px-3 py-2">Quiz</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">
                            18/20
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Documents reçus */}
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Documents reçus</h3>
                </header>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    Charte informatique (PDF)
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    Planning examens S1 (PDF)
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    Attestation d’assurance (étudiant)
                  </li>
                </ul>
              </section>

              {/* Notifications */}
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Notifications</h3>
                </header>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    À faire : compléter votre profil ENT
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    Absence non justifiée du 06/10
                  </li>
                  <li className="rounded-lg border bg-slate-50 px-3 py-2">
                    Nouveau message du référent pédagogique
                  </li>
                </ul>
              </section>
            </div>
          </section>

          {/* Bons plans étudiants */}
          <aside className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Bons plans étudiants
            </h2>
            <div className="space-y-3">
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">GitHub Student Developer Pack</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Outils dev gratuits (domaines, crédits cloud, IDE).
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">
                  Spotify Premium Étudiant — -50%
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Abonnement étudiant à prix réduit (12 mois renouvelables).
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">
                  Adobe Creative Cloud — offre éducation
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Photoshop, Illustrator, etc. à tarif préférentiel.
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">
                  Notion &amp; Figma — licences éducation
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Accès pro gratuit pour projets académiques.
                </p>
              </article>
              <article className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Transports étudiants</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Réductions régionales (ex. Navigo) selon votre statut.
                </p>
              </article>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

