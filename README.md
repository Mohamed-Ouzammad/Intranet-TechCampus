📘 README – Intranet TechCampus

Bienvenue dans le dépôt du nouvel Intranet TechCampus, un espace de gestion complet pour campus, étudiants, intervenants et responsables pédagogiques.

Ce projet est composé de deux parties :
- Frontend → Next.js 14 (App Router)
- Backend → Node.js + Express + TypeScript + PostgreSQL

🚀 Démonstration

Frontend (Netlify) :

➡️ https://intranetfront.netlify.app

Backend API (Render) :

➡️ https://back-intra.onrender.com/api-docs/


🧠 Fonctionnalités principales

🔐 Authentification & rôles
- Connexion email + mot de passe
- JWT sécurisé (stocké côté client)
- Rôles supportés :
  - Admin
  - Responsable pédagogique
  - Assistant pédagogique
  - Intervenant
  - Étudiant
- Permissions dynamiques (front + back)

🏫 Multi-campus (WIP / US validée)
- Sélecteur de campus
- Filtrage automatique des données
- Vision multi-sites pour les administrateurs

👨‍🏫 Gestion utilisateurs
- Création
- Attribution de rôles
- Affectation campus / classe
- Réinitialisation de mot de passe (à venir)

📚 Gestion pédagogique
- Cours
- Notes
- Documents
- Absences
- Planning