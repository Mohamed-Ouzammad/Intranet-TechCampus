"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Erreur de connexion. Vérifiez vos identifiants.");
      }
      // Log pour débogage (à retirer en production)
      console.error("Erreur de login:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-gray-600">
          Connectez-vous pour accéder à votre espace intranet.
        </p>

        {serverError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="prenom.nom@tech-campus.fr"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none 
                        placeholder:text-gray-500
                        focus:border-blue-500 focus:ring-1 ring-blue-500"
              {...register("email", {
                required: "L’email est obligatoire",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email invalide",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none
                        placeholder:text-gray-500
                        focus:border-blue-500 focus:ring-1 ring-blue-500"
              {...register("password", {
                required: "Le mot de passe est obligatoire",
                minLength: {
                  value: 6,
                  message: "Au moins 6 caractères",
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white 
                       hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
