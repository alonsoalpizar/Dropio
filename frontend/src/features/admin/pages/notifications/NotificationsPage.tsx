import { useState } from "react";
import { Mail, Send, History, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSendEmail, useNotificationHistory } from "../../hooks/useAdminNotifications";
import type { SendEmailInput, EmailRecipient, ViewNotificationHistoryInput } from "../../types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"send" | "history">("send");

  // Send email form state
  const [recipients, setRecipients] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");

  const sendEmailMutation = useSendEmail();

  // History state
  const [historyFilters] = useState<ViewNotificationHistoryInput>({
    limit: 20,
    offset: 0,
  });

  const { data: historyData, isLoading: historyLoading } = useNotificationHistory(
    historyFilters,
    activeTab === "history"
  );

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse recipients (separated by commas or newlines)
    const emailList = recipients
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      alert("Por favor ingresa al menos un destinatario");
      return;
    }

    const recipientObjects: EmailRecipient[] = emailList.map((email) => ({ email }));

    const input: SendEmailInput = {
      to: recipientObjects,
      subject,
      body,
      priority,
    };

    await sendEmailMutation.mutateAsync(input);

    // Reset form
    setRecipients("");
    setSubject("");
    setBody("");
    setPriority("normal");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent-green/20 text-accent-green">
            <CheckCircle className="w-3 h-3" />
            Enviado
          </span>
        );
      case "queued":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold">
            <Clock className="w-3 h-3" />
            En cola
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent-blue/20 text-accent-blue">
            <Clock className="w-3 h-3" />
            Programado
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3" />
            Fallido
          </span>
        );
      default:
        return <span className="text-xs text-neutral-500">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="text-xs font-medium text-red-400">Alta</span>;
      case "normal":
        return <span className="text-xs text-neutral-400">Normal</span>;
      case "low":
        return <span className="text-xs text-neutral-500">Baja</span>;
      default:
        return <span className="text-xs text-neutral-500">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Notificaciones</h1>
        <p className="text-neutral-400 mt-2">Envía emails administrativos y revisa el historial</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-lighter">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("send")}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeTab === "send"
                ? "border-gold text-gold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Enviar Email
            </div>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              activeTab === "history"
                ? "border-gold text-gold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial
            </div>
          </button>
        </div>
      </div>

      {/* Send Email Tab */}
      {activeTab === "send" && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-gold" />
            <div>
              <h2 className="text-xl font-semibold text-white">Enviar Email</h2>
              <p className="text-sm text-neutral-400">Envía un email a uno o varios destinatarios</p>
            </div>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Destinatarios *
              </label>
              <textarea
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent"
                rows={3}
                placeholder="ejemplo@email.com, otro@email.com (separados por comas o saltos de línea)"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Puedes ingresar múltiples emails separados por comas o saltos de línea
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Asunto *</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent"
                placeholder="Asunto del email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Mensaje *</label>
              <textarea
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent"
                rows={8}
                placeholder="Escribe el contenido del email..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Prioridad</label>
              <select
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "normal" | "high")}
              >
                <option value="low">Baja</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-lighter">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRecipients("");
                  setSubject("");
                  setBody("");
                  setPriority("normal");
                }}
              >
                Limpiar
              </Button>
              <Button type="submit" disabled={sendEmailMutation.isPending}>
                {sendEmailMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 mr-2 inline-block">
                      <LoadingSpinner />
                    </div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <>
          {/* Statistics */}
          {historyData?.statistics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4 bg-dark-card border-dark-lighter">
                <p className="text-sm font-medium text-neutral-400">Total Enviados</p>
                <p className="text-2xl font-bold text-accent-green mt-2">
                  {historyData.statistics.total_sent}
                </p>
              </Card>
              <Card className="p-4 bg-dark-card border-dark-lighter">
                <p className="text-sm font-medium text-neutral-400">Total Fallidos</p>
                <p className="text-2xl font-bold text-red-400 mt-2">
                  {historyData.statistics.total_failed}
                </p>
              </Card>
              <Card className="p-4 bg-dark-card border-dark-lighter">
                <p className="text-sm font-medium text-neutral-400">En Cola</p>
                <p className="text-2xl font-bold text-gold mt-2">
                  {historyData.statistics.total_queued}
                </p>
              </Card>
              <Card className="p-4 bg-dark-card border-dark-lighter">
                <p className="text-sm font-medium text-neutral-400">Programados</p>
                <p className="text-2xl font-bold text-accent-blue mt-2">
                  {historyData.statistics.total_scheduled}
                </p>
              </Card>
              <Card className="p-4 bg-dark-card border-dark-lighter">
                <p className="text-sm font-medium text-neutral-400">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {historyData.statistics.success_rate.toFixed(1)}%
                </p>
              </Card>
            </div>
          )}

          {/* History Table */}
          <Card className="p-6 bg-dark-card border-dark-lighter">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historial de Notificaciones ({historyData?.total_count || 0})
            </h2>

            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : historyData?.notifications && historyData.notifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-lighter border-b-2 border-dark-lighter">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Asunto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Destinatarios
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Prioridad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Enviado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-lighter">
                    {historyData.notifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-dark-lighter">
                        <td className="px-4 py-3 text-sm text-white">#{notification.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white max-w-md truncate">
                            {notification.subject || "-"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-neutral-400">
                            <Users className="w-4 h-4" />
                            {notification.recipient_count}
                          </div>
                        </td>
                        <td className="px-4 py-3">{getPriorityBadge(notification.priority)}</td>
                        <td className="px-4 py-3">{getStatusBadge(notification.status)}</td>
                        <td className="px-4 py-3 text-sm text-neutral-400">
                          {notification.sent_at
                            ? format(parseISO(notification.sent_at), "PPp", { locale: es })
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-400">
                          {notification.admin_email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<History className="w-12 h-12 text-neutral-500" />}
                title="No hay notificaciones"
                description="No se encontraron notificaciones en el historial"
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
