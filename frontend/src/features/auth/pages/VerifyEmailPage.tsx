import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useVerifyEmail, useUser } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import * as authApi from "@/api/auth";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const user = useUser();
  const verifyEmailMutation = useVerifyEmail();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Mutation para reenviar código
  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerificationCode(user?.id || 0),
    onSuccess: (data) => {
      setResendSuccess(data.message);
      setError("");
      // Cooldown de 60 segundos
      setResendCooldown(60);
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setResendSuccess("");
    },
  });

  // Efecto para el countdown del cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.email_verified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    if (!user?.id) {
      setError("Error: Usuario no encontrado");
      return;
    }

    verifyEmailMutation.mutate(
      {
        user_id: user.id,
        code: code,
      },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (err) => {
          setError(getErrorMessage(err));
        },
      }
    );
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    setError("");
  };

  if (!user) {
    return null;
  }

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
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Verificar Email
          </h1>
          <p className="text-neutral-400">
            Ingresa el código de 6 dígitos que enviamos a{" "}
            <span className="font-semibold text-gold">{user.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {verifyEmailMutation.isSuccess && (
            <Alert variant="success" className="bg-accent-green/10 border-accent-green/30 text-accent-green">
              <AlertDescription>
                ¡Email verificado exitosamente! Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert variant="success" className="bg-accent-green/10 border-accent-green/30 text-accent-green">
              <AlertDescription>
                {resendSuccess}
              </AlertDescription>
            </Alert>
          )}

          {(error || verifyEmailMutation.isError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || getErrorMessage(verifyEmailMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="code" required className="text-neutral-300">
              Código de Verificación
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              className="text-center text-3xl tracking-[0.5em] font-mono bg-dark border-dark-lighter text-white placeholder:text-neutral-600 focus:border-gold focus:ring-gold/20 h-16"
              autoComplete="off"
            />
            <p className="text-xs text-neutral-500 text-center">
              El código expira en 15 minutos
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-gold to-gold-dark text-dark font-semibold hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
            loading={verifyEmailMutation.isPending}
            disabled={
              verifyEmailMutation.isPending ||
              code.length !== 6 ||
              verifyEmailMutation.isSuccess
            }
          >
            Verificar Email
          </Button>

          <div className="text-center">
            <button
              type="button"
              className={`text-sm font-medium transition-colors ${
                resendMutation.isPending || resendCooldown > 0
                  ? "text-neutral-500 cursor-not-allowed"
                  : "text-gold hover:text-gold-light"
              }`}
              onClick={() => {
                setResendSuccess("");
                setError("");
                resendMutation.mutate();
              }}
              disabled={resendMutation.isPending || resendCooldown > 0}
            >
              {resendMutation.isPending
                ? "Enviando..."
                : resendCooldown > 0
                ? `Reenviar código (${resendCooldown}s)`
                : "¿No recibiste el código? Reenviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
