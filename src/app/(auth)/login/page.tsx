import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Login:", data);
    // TODO: call backend login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Connexion,test</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="border p-3 rounded-md"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            {...register("password")}
            className="border p-3 rounded-md"
          />

          <button className="bg-primary text-white py-2 rounded-md hover:bg-primary/90">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
