import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useIsAuthenticated } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-gold/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-gold/[0.04] rounded-full blur-[100px]" />
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
      <div className="w-full max-w-md bg-dark-card border border-dark-lighter rounded-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-neutral-400">
            Ingresa tu email y contraseña para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {loginMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(loginMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" required className="text-neutral-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              className="bg-dark border-dark-lighter text-white placeholder:text-neutral-500 focus:border-gold focus:ring-gold/20"
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required className="text-neutral-300">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              className="bg-dark border-dark-lighter text-white placeholder:text-neutral-500 focus:border-gold focus:ring-gold/20"
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-gold to-gold-dark text-dark font-semibold hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            Iniciar Sesión
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dark-lighter" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-card px-3 text-neutral-500">O continúa con</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <GoogleAuthButton mode="login" />

          <div className="text-center text-sm pt-2">
            <span className="text-neutral-400">
              ¿No tienes una cuenta?{" "}
            </span>
            <Link
              to="/register"
              className="text-gold hover:text-gold-light font-medium transition-colors"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
