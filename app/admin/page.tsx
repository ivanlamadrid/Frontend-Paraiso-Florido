import { createClient } from "@/app/utils/supabase/server"; 
import { InfoIcon, UserIcon, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Error retrieving user or not authenticated:", authError);
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">¡Bienvenido, {user?.email || "Usuario"}! 👋</h1>
          <p className="text-gray-600 text-lg">
            Te has autenticado correctamente. Aquí encontrarás los detalles de tu cuenta y los próximos pasos para continuar.
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg flex items-start gap-4 mb-8">
          <InfoIcon size={24} className="text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-blue-800 pb-2">Lazarus Technologies</h2>
            <p className="text-gray-700">
              Esta aplicación web ha sido desarrollada por Lazarus Technologies E.I.R.L. Si tienes alguna duda o pregunta, no dudes en contactarnos a través del correo: soporte@lazarus.pe.
            </p>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <UserIcon size={24} className="text-gray-700" />
            Detalles de tu cuenta
          </h2>

          <div className="mt-4 bg-gray-100 p-5 rounded-lg shadow-sm border border-gray-300">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Correo electrónico:</h3>
                <p className="text-lg font-semibold text-gray-800">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 font-medium">ID de usuario:</h3>
                <p className="text-lg font-semibold text-gray-800">{user.id}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Fecha de creación:</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(user.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos pasos</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <ArrowRight size={20} className="text-green-600" />
              Explora tu panel de administración para gestionar tus recursos.
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <ArrowRight size={20} className="text-green-600" />
              Actualiza la información de tu perfil si es necesario.
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <ArrowRight size={20} className="text-green-600" />
              Contacta al soporte si tienes alguna pregunta o necesitas ayuda.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
