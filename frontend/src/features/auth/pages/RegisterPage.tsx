import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister, useIsAuthenticated } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(12, "La contraseña debe tener al menos 12 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
    confirmPassword: z.string(),
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    phone: z.string().optional(),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
    accept_privacy: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar la política de privacidad",
    }),
    accept_marketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      accept_terms: false,
      accept_privacy: false,
      accept_marketing: false,
    },
  });

  const password = watch("password", "");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, accept_terms, accept_privacy, accept_marketing, ...rest } = data;

    // Transformar nombres de campos para coincidir con backend
    const registerData = {
      ...rest,
      accepted_terms: accept_terms,
      accepted_privacy: accept_privacy,
      accepted_marketing: accept_marketing,
    };

    registerMutation.mutate(registerData, {
      onSuccess: () => {
        navigate("/verify-email");
      },
    });
  };

  const inputClassName = "bg-dark border-dark-lighter text-white placeholder:text-neutral-500 focus:border-gold focus:ring-gold/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[500px] h-[500px] bg-gold/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Logo/Link al landing */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 z-10"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-sm">
          🪙
        </div>
        <span className="text-xl font-bold text-white">
          Dropio<span className="text-gold">.club</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-2xl bg-dark-card border border-dark-lighter rounded-2xl p-8 my-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crear Cuenta
          </h1>
          <p className="text-neutral-400">
            Únete al Club Dropio y comienza a ganar AloCoins
          </p>
        </div>

        {/* Google OAuth Button - Registro rápido */}
        <div className="mb-6">
          <GoogleAuthButton mode="register" />
          <p className="text-xs text-center text-neutral-500 mt-2">
            Al registrarte con Google, aceptas automáticamente los términos y condiciones
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dark-lighter" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dark-card px-3 text-neutral-500">O regístrate con email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registerMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(registerMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" required className="text-neutral-300">
                Nombre
              </Label>
              <Input
                id="first_name"
                placeholder="Juan"
                error={errors.first_name?.message}
                className={inputClassName}
                {...register("first_name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" required className="text-neutral-300">
                Apellido
              </Label>
              <Input
                id="last_name"
                placeholder="Pérez"
                error={errors.last_name?.message}
                className={inputClassName}
                {...register("last_name")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required className="text-neutral-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              className={inputClassName}
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-neutral-300">
              Teléfono (opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+506 8888-8888"
              error={errors.phone?.message}
              className={inputClassName}
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required className="text-neutral-300">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              className={inputClassName}
              {...register("password")}
            />
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required className="text-neutral-300">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              error={errors.confirmPassword?.message}
              className={inputClassName}
              {...register("confirmPassword")}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accept_terms"
                className="mt-1 h-4 w-4 rounded border-dark-lighter bg-dark text-gold focus:ring-gold/50 focus:ring-offset-dark-card"
                {...register("accept_terms")}
              />
              <div className="flex-1">
                <label
                  htmlFor="accept_terms"
                  className="text-sm text-neutral-400"
                >
                  Acepto los{" "}
                  <Link to="/terms" className="text-gold hover:text-gold-light">
                    términos y condiciones
                  </Link>
                </label>
                {errors.accept_terms && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.accept_terms.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accept_privacy"
                className="mt-1 h-4 w-4 rounded border-dark-lighter bg-dark text-gold focus:ring-gold/50 focus:ring-offset-dark-card"
                {...register("accept_privacy")}
              />
              <div className="flex-1">
                <label
                  htmlFor="accept_privacy"
                  className="text-sm text-neutral-400"
                >
                  Acepto la{" "}
                  <Link to="/privacy" className="text-gold hover:text-gold-light">
                    política de privacidad
                  </Link>
                </label>
                {errors.accept_privacy && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.accept_privacy.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accept_marketing"
                className="mt-1 h-4 w-4 rounded border-dark-lighter bg-dark text-gold focus:ring-gold/50 focus:ring-offset-dark-card"
                {...register("accept_marketing")}
              />
              <label
                htmlFor="accept_marketing"
                className="text-sm text-neutral-400"
              >
                Acepto recibir comunicaciones de marketing (opcional)
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-gold to-gold-dark text-dark font-semibold hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            Crear Cuenta
          </Button>

          <div className="text-center text-sm pt-2">
            <span className="text-neutral-400">
              ¿Ya tienes una cuenta?{" "}
            </span>
            <Link
              to="/login"
              className="text-gold hover:text-gold-light font-medium transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
