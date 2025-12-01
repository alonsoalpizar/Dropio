import { useState } from 'react';
import { User, Wallet, FileText, Edit2, Upload, Check, X } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useConfigureIBAN } from '../hooks/useConfigureIBAN';
import { useUploadKYCDocument } from '../hooks/useUploadKYCDocument';
import { formatCRC } from '../../../types/wallet';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { data, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const configureIBAN = useConfigureIBAN();
  const uploadKYCDocument = useUploadKYCDocument();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingIBAN, setIsEditingIBAN] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    cedula: '',
    date_of_birth: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const [ibanForm, setIbanForm] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Cargando perfil..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-500/10 border-red-500/30">
          <p className="text-red-400">Error al cargar el perfil: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { user, wallet, kyc_documents, can_withdraw } = data;

  const kycStatus = {
    cedula_front: kyc_documents.find((d) => d.document_type === 'cedula_front'),
    cedula_back: kyc_documents.find((d) => d.document_type === 'cedula_back'),
    selfie: kyc_documents.find((d) => d.document_type === 'selfie'),
  };

  const kycLevelLabels = {
    none: 'Sin verificar',
    email_verified: 'Email verificado',
    phone_verified: 'Teléfono verificado',
    cedula_verified: 'Cédula verificada',
    full_kyc: 'Verificación completa',
  };

  const handleEditPersonal = () => {
    setPersonalForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      cedula: user.cedula || '',
      date_of_birth: user.date_of_birth || '',
      address_line1: user.address_line1 || '',
      address_line2: user.address_line2 || '',
      city: user.city || '',
      state: user.state || '',
      postal_code: user.postal_code || '',
    });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    try {
      await updateProfile.mutateAsync(personalForm);
      setIsEditingPersonal(false);
      toast.success('Perfil actualizado correctamente');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al actualizar perfil');
    }
  };

  const handleCancelPersonal = () => setIsEditingPersonal(false);

  const handleEditIBAN = () => {
    setIbanForm(user.iban || '');
    setIsEditingIBAN(true);
  };

  const handleSaveIBAN = async () => {
    if (!ibanForm || ibanForm.length !== 24) {
      toast.error('IBAN debe tener 24 caracteres (CR + 22 dígitos)');
      return;
    }
    try {
      await configureIBAN.mutateAsync(ibanForm);
      setIsEditingIBAN(false);
      toast.success('IBAN configurado correctamente');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al configurar IBAN');
    }
  };

  const handleCancelIBAN = () => setIsEditingIBAN(false);

  const handleFileUpload = async (
    docType: 'cedula_front' | 'cedula_back' | 'selfie',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    setUploadingDoc(docType);

    try {
      const fakeUrl = `https://dropio.club/uploads/kyc/${Date.now()}_${file.name}`;
      await uploadKYCDocument.mutateAsync({ documentType: docType, fileUrl: fakeUrl });
      toast.success('Documento subido correctamente');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al subir documento');
    } finally {
      setUploadingDoc(null);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-dark-lighter rounded-xl bg-dark-card text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors";
  const labelClass = "block text-sm font-medium text-neutral-300 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <span className="text-gold">🪙</span> Mi Perfil
      </h1>

      {/* Información Personal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-xl font-semibold text-white">Información Personal</h2>
          </div>
          {!isEditingPersonal && (
            <Button variant="outline" size="sm" onClick={handleEditPersonal}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        {isEditingPersonal ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={personalForm.first_name}
                  onChange={(e) => setPersonalForm({ ...personalForm, first_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Apellidos</label>
                <input
                  type="text"
                  value={personalForm.last_name}
                  onChange={(e) => setPersonalForm({ ...personalForm, last_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input
                  type="tel"
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  className={inputClass}
                  placeholder="88887777"
                />
              </div>
              <div>
                <label className={labelClass}>Cédula</label>
                <input
                  type="text"
                  value={personalForm.cedula}
                  onChange={(e) => setPersonalForm({ ...personalForm, cedula: e.target.value })}
                  className={inputClass}
                  placeholder="1-2345-6789"
                />
              </div>
              <div>
                <label className={labelClass}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={personalForm.date_of_birth}
                  onChange={(e) => setPersonalForm({ ...personalForm, date_of_birth: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark-lighter">
              <h3 className="text-lg font-semibold text-white mb-4">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Dirección Línea 1</label>
                  <input
                    type="text"
                    value={personalForm.address_line1}
                    onChange={(e) => setPersonalForm({ ...personalForm, address_line1: e.target.value })}
                    className={inputClass}
                    placeholder="Calle principal, número de casa"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Dirección Línea 2</label>
                  <input
                    type="text"
                    value={personalForm.address_line2}
                    onChange={(e) => setPersonalForm({ ...personalForm, address_line2: e.target.value })}
                    className={inputClass}
                    placeholder="Apartamento, suite (opcional)"
                  />
                </div>
                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input
                    type="text"
                    value={personalForm.city}
                    onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
                    className={inputClass}
                    placeholder="San José"
                  />
                </div>
                <div>
                  <label className={labelClass}>Provincia</label>
                  <input
                    type="text"
                    value={personalForm.state}
                    onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
                    className={inputClass}
                    placeholder="San José"
                  />
                </div>
                <div>
                  <label className={labelClass}>Código Postal</label>
                  <input
                    type="text"
                    value={personalForm.postal_code}
                    onChange={(e) => setPersonalForm({ ...personalForm, postal_code: e.target.value })}
                    className={inputClass}
                    placeholder="10101"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancelPersonal}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSavePersonal} disabled={updateProfile.isPending}>
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Nombre Completo</p>
              <p className="font-medium text-white">
                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'No configurado'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Email</p>
              <p className="font-medium text-white">{user.email}</p>
              {user.email_verified && <span className="text-xs text-accent-green">✓ Verificado</span>}
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Teléfono</p>
              <p className="font-medium text-white">{user.phone || 'No configurado'}</p>
              {user.phone_verified && user.phone && <span className="text-xs text-accent-green">✓ Verificado</span>}
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Cédula</p>
              <p className="font-medium text-white">{user.cedula || 'No configurada'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Fecha de Nacimiento</p>
              <p className="font-medium text-white">
                {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('es-CR') : 'No configurada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Nivel KYC</p>
              <p className="font-medium text-gold">{kycLevelLabels[user.kyc_level]}</p>
            </div>
          </div>
        )}
      </Card>

      {/* AloCoins */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">🪙</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Mis AloCoins</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-lighter rounded-xl p-4">
            <p className="text-sm text-neutral-400 mb-1">Saldo Disponible</p>
            <p className="text-2xl font-bold text-gold flex items-center gap-2">
              🪙 {formatCRC(parseFloat(wallet.balance_available)).replace('₡', '')}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Para participar en Drops</p>
          </div>

          <div className="bg-dark-lighter rounded-xl p-4">
            <p className="text-sm text-neutral-400 mb-1">Ganancias</p>
            <p className="text-2xl font-bold text-accent-green">
              {formatCRC(parseFloat(wallet.earnings_balance))}
            </p>
            <p className="text-xs text-neutral-500 mt-1">De tus Drops ganados</p>
          </div>

          <div className="bg-dark-lighter rounded-xl p-4">
            <p className="text-sm text-neutral-400 mb-1">Estado de Retiros</p>
            <p className={`text-lg font-semibold ${can_withdraw ? 'text-accent-green' : 'text-gold'}`}>
              {can_withdraw ? '✓ Habilitado' : '✗ Deshabilitado'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {can_withdraw ? 'Puedes retirar ganancias' : 'Completa KYC y configura IBAN'}
            </p>
          </div>
        </div>
      </Card>

      {/* Documentos KYC */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent-purple/20 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent-purple" />
          </div>
          <h2 className="text-xl font-semibold text-white">Documentos KYC</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['cedula_front', 'cedula_back', 'selfie'] as const).map((docType) => {
            const doc = kycStatus[docType];
            const labels = {
              cedula_front: 'Cédula (Frente)',
              cedula_back: 'Cédula (Dorso)',
              selfie: 'Selfie con Cédula',
            };
            const isUploading = uploadingDoc === docType;

            return (
              <div key={docType} className="p-4 border border-dark-lighter rounded-xl">
                <p className="font-medium text-white mb-3">{labels[docType]}</p>

                {doc ? (
                  <div className="space-y-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        doc.verification_status === 'approved'
                          ? 'bg-accent-green/20 text-accent-green'
                          : doc.verification_status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gold/20 text-gold'
                      }`}
                    >
                      {doc.verification_status === 'approved'
                        ? 'Aprobado'
                        : doc.verification_status === 'rejected'
                        ? 'Rechazado'
                        : 'Pendiente'}
                    </span>
                    {doc.rejected_reason && <p className="text-xs text-red-400 mt-1">{doc.rejected_reason}</p>}
                    {doc.verification_status !== 'approved' && (
                      <label className="block mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(docType, e)}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={isUploading}
                          onClick={(e) => {
                            e.preventDefault();
                            (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? 'Subiendo...' : 'Resubir'}
                        </Button>
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(docType, e)}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={isUploading}
                      onClick={(e) => {
                        e.preventDefault();
                        (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Subiendo...' : 'Subir'}
                    </Button>
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-xl">
          <p className="text-sm text-accent-blue">
            <strong>Importante:</strong> Sube imágenes claras y legibles. Los documentos serán revisados por nuestro equipo en un plazo de 24-48 horas.
          </p>
        </div>
      </Card>

      {/* IBAN */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-green/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent-green" />
            </div>
            <h2 className="text-xl font-semibold text-white">Información Bancaria</h2>
          </div>
          {!isEditingIBAN && (user.iban || user.kyc_level === 'full_kyc') && (
            <Button variant="outline" size="sm" onClick={handleEditIBAN}>
              <Edit2 className="w-4 h-4 mr-2" />
              {user.iban ? 'Editar' : 'Configurar'}
            </Button>
          )}
        </div>

        {user.kyc_level !== 'full_kyc' && !user.iban ? (
          <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl">
            <p className="text-sm text-gold">
              Debes completar la verificación KYC antes de configurar tu IBAN para retiros.
            </p>
          </div>
        ) : isEditingIBAN ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>IBAN de Costa Rica</label>
              <input
                type="text"
                value={ibanForm}
                onChange={(e) => setIbanForm(e.target.value.toUpperCase())}
                className={`${inputClass} font-mono`}
                placeholder="CR12345678901234567890"
                maxLength={24}
              />
              <p className="text-xs text-neutral-500 mt-2">
                Formato: CR + 22 dígitos (24 caracteres en total)
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelIBAN}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSaveIBAN} disabled={configureIBAN.isPending}>
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        ) : user.iban ? (
          <div>
            <p className="text-sm text-neutral-500 mb-1">IBAN Configurado</p>
            <p className="font-mono text-lg font-medium text-white">{user.iban}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};
