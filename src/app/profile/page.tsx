"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, Role, ROLE_LABELS } from "@/lib/auth";
import { useForm } from "react-hook-form";

type UserProfile = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  postalAddress: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfile>();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setRole(user.role);
      reset({
        firstName: "Mohamed",
        lastName: "Ouzammad",
        dateOfBirth: "1999-11-09",
        email: user.email,
        postalAddress: "123 Rue de la République, 75001 Paris",
      });
    }
  }, [router, reset]);

  const onSubmit = async (data: UserProfile) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Profil mis à jour avec succès ! (Simulation)");
      setIsEditing(false);
    } catch (error) {
      alert("Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!role) {
    return (
      <div className="text-sm text-gray-900">
        Chargement de votre profil...
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[role];

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-gray-900">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mon profil</h1>
          <p className="mt-1 text-sm text-gray-900">
            Rôle : <span className="font-medium text-gray-900">{roleLabel}</span>
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Modifier
          </button>
        )}
      </header>
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Prénom */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="firstName"
              >
                Prénom
              </label>
              {isEditing ? (
                <>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", {
                      required: "Le prénom est obligatoire",
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  Mohamed
                </p>
              )}
            </div>
            {/* Nom */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="lastName"
              >
                Nom
              </label>
              {isEditing ? (
                <>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", {
                      required: "Le nom est obligatoire",
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  Ouzammad
                </p>
              )}
            </div>
            {/* Date de naissance */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="dateOfBirth"
              >
                Date de naissance
              </label>
              {isEditing ? (
                <>
                  <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth", {
                      required: "La date de naissance est obligatoire",
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  09/11/1999
                </p>
              )}
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="email"
              >
                Adresse email
              </label>
              {isEditing ? (
                <>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "L'email est obligatoire",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email invalide",
                      },
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                  )}
                </>
              ) : (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  momo@test.com
                </p>
              )}
            </div>
          </div>
          {/* Adresse postale */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-900"
              htmlFor="postalAddress"
            >
              Adresse postale
            </label>
            {isEditing ? (
              <>
                <textarea
                  id="postalAddress"
                  rows={3}
                  {...register("postalAddress", {
                    required: "L'adresse postale est obligatoire",
                  })}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.postalAddress && (
                  <p className="text-xs text-red-600">
                    {errors.postalAddress.message}
                  </p>
                )}
              </>
            ) : (
              <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                123 Rue de la République, 75001 Paris
              </p>
            )}
          </div>
          {/* Boutons d'action */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
