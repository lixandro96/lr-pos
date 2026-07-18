import { useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { useSession } from "./context/useSession";

function LoginPage() {
  const {
    login,
    activeUsers,
    userRoles,
    simulatedPassword,
  } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit =
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  function updateField(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const result = login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.ok) {
      setErrorMessage(result.message);
    }
  }

  return (
    <main
      className="
        flex min-h-dvh items-center justify-center
        bg-[#3B281F] p-4
      "
    >
      <section
        className="
          w-full max-w-md rounded-3xl
          bg-white p-6 shadow-2xl
        "
      >
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6F4E37]">
            LR POS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Usa un usuario simulado para probar los roles del sistema.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            id="login-email"
            label="Correo"
            type="email"
            placeholder="admin@lrpos.com"
            value={formData.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
          />

          <Input
            id="login-password"
            label="Contraseña"
            type="password"
            placeholder="123456"
            value={formData.password}
            onChange={(event) =>
              updateField("password", event.target.value)
            }
            helperText={`Contraseña simulada: ${simulatedPassword}`}
          />

          {errorMessage && (
            <div
              className="
                rounded-xl border border-red-200
                bg-red-50 px-4 py-3
                text-sm text-red-700
              "
            >
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit}
          >
            Entrar
          </Button>
        </form>

        <div
          className="
            mt-6 rounded-2xl border border-gray-200
            bg-gray-50 p-4
          "
        >
          <p className="text-sm font-semibold text-gray-900">
            Usuarios disponibles
          </p>

          <div className="mt-3 space-y-2">
            {activeUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() =>
                  setFormData({
                    email: user.email,
                    password: simulatedPassword,
                  })
                }
                className="
                  w-full rounded-xl border border-gray-200
                  bg-white px-3 py-2 text-left
                  text-sm transition hover:border-[#6F4E37]/40
                "
              >
                <span className="block font-medium text-gray-900">
                  {user.name}
                </span>

                <span className="block text-gray-500">
                  {user.email} ·{" "}
                  {userRoles[user.role]?.label ?? user.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;