import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, History, RefreshCw, ArrowRightLeft, Gift } from 'lucide-react';
import { RechargeOptions } from '../components/RechargeOptions';
import { TransactionHistory } from '../components/TransactionHistory';
import { AnimatedCoin } from '../components/AnimatedCoin';
import { useWalletBalance } from '../hooks/useWallet';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

type Tab = 'recharge' | 'history';

// Helper para formatear CRC
function formatCRC(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper para formatear AloCoins
function formatALO(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const WalletPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('recharge');
  const [showAsColones, setShowAsColones] = useState(false);
  const { data: walletData, isLoading, refetch } = useWalletBalance();

  const balanceAmount = walletData ? parseFloat(walletData.balance) || 0 : 0;
  // TODO: Implementar tracking de AloCoins usados (burn)
  const usedAmount = 0;

  const tabs = [
    { id: 'recharge' as Tab, label: 'Comprar', icon: TrendingUp },
    { id: 'history' as Tab, label: 'Historial', icon: History },
  ];

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - AloCoins Dashboard */}
        <div className="relative mb-8 p-8 rounded-2xl bg-gradient-to-br from-dark-card to-dark border border-dark-lighter overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Header con refresh */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Mi Billetera</h1>
              <button
                onClick={() => refetch()}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Actualizar saldo"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Moneda animada */}
              <div className="flex-shrink-0">
                {isLoading ? (
                  <div className="w-32 h-32 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <AnimatedCoin size="xl" animated={balanceAmount > 0} />
                )}
              </div>

              {/* Balance y controles */}
              <div className="flex-1 text-center md:text-left">
                {/* Toggle y Balance */}
                <div className="mb-4">
                  <p className="text-sm text-neutral-400 mb-1">Saldo disponible</p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {showAsColones ? (
                        formatCRC(balanceAmount)
                      ) : (
                        <>
                          {formatALO(balanceAmount)}
                          <span className="text-gold ml-2 text-2xl md:text-3xl">ALO</span>
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => setShowAsColones(!showAsColones)}
                      className="p-2 bg-dark-lighter hover:bg-gold/20 rounded-lg transition-colors group"
                      title={showAsColones ? "Ver en AloCoins" : "Ver en Colones"}
                    >
                      <ArrowRightLeft className="w-5 h-5 text-neutral-400 group-hover:text-gold transition-colors" />
                    </button>
                  </div>
                  {!showAsColones && (
                    <p className="text-sm text-neutral-500 mt-1">
                      ≈ {formatCRC(balanceAmount)}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setActiveTab('recharge')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-dark font-semibold rounded-xl transition-all"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Comprar AloCoins</span>
                  </button>
                  <button
                    onClick={() => navigate('/explore')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-lighter hover:bg-dark-lighter/80 text-white font-semibold rounded-xl border border-dark-lighter hover:border-gold/50 transition-all"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Canjear en Drops</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats: Disponibles / Utilizados */}
            <div className="mt-8 pt-6 border-t border-dark-lighter grid grid-cols-2 gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                  <span className="text-sm text-neutral-400">Disponibles</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <img src="/assets/alocoin.png" alt="ALO" className="w-5 h-5" />
                  <span className="text-xl font-bold text-white">{formatALO(balanceAmount)}</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full" />
                  <span className="text-sm text-neutral-400">Utilizados</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <img
                    src="/assets/alocoin.png"
                    alt="ALO"
                    className="w-5 h-5 opacity-50 grayscale"
                  />
                  <span className="text-xl font-bold text-neutral-500">{formatALO(usedAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-dark-lighter">
          <nav className="-mb-px flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-all",
                    isActive
                      ? 'border-gold text-gold'
                      : 'border-transparent text-neutral-500 hover:text-white hover:border-dark-lighter'
                  )}
                >
                  <Icon
                    className={cn(
                      "-ml-0.5 mr-2 h-5 w-5 transition-colors",
                      isActive ? 'text-gold' : 'text-neutral-500 group-hover:text-white'
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'recharge' && (
            <div className="space-y-6">
              <RechargeOptions />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <TransactionHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
