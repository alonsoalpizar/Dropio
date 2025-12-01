import { useState } from 'react';
import { Wallet, TrendingUp, History, Trophy } from 'lucide-react';
import { WalletBalance } from '../components/WalletBalance';
import { RechargeOptions } from '../components/RechargeOptions';
import { TransactionHistory } from '../components/TransactionHistory';
import { Earnings } from '../components/Earnings';
import { cn } from '@/lib/utils';

type Tab = 'balance' | 'recharge' | 'history' | 'earnings';

export const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('balance');

  const tabs = [
    { id: 'balance' as Tab, label: 'Mis AloCoins', icon: Wallet },
    { id: 'recharge' as Tab, label: 'Comprar', icon: TrendingUp },
    { id: 'history' as Tab, label: 'Historial', icon: History },
    { id: 'earnings' as Tab, label: 'Ganancias', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🪙</span>
            <h1 className="text-3xl font-bold text-white">Mis AloCoins</h1>
          </div>
          <p className="text-neutral-400">
            Gestiona tus AloCoins, compra más y revisa tu historial de transacciones
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-dark-lighter">
          <nav className="-mb-px flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group inline-flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap",
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
          {activeTab === 'balance' && (
            <div className="space-y-6">
              <WalletBalance showRefreshButton={true} compact={false} />

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('recharge')}
                  className="p-6 bg-dark-card border-2 border-gold/30 rounded-xl hover:border-gold hover:bg-gold/5 transition-all text-left group"
                >
                  <TrendingUp className="w-6 h-6 text-gold mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-white mb-1">Comprar AloCoins</h3>
                  <p className="text-sm text-neutral-400">
                    Agrega AloCoins a tu billetera con tus métodos de pago preferidos
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className="p-6 bg-dark-card border border-dark-lighter rounded-xl hover:border-neutral-500 transition-all text-left group"
                >
                  <History className="w-6 h-6 text-neutral-400 mb-2 group-hover:text-white transition-colors" />
                  <h3 className="font-semibold text-white mb-1">Ver historial</h3>
                  <p className="text-sm text-neutral-400">
                    Revisa todas tus transacciones y movimientos de AloCoins
                  </p>
                </button>
              </div>

              {/* Info box */}
              <div className="rounded-xl p-5 border border-gold/20 bg-gold/5">
                <h3 className="font-semibold mb-3 text-gold flex items-center gap-2">
                  <span className="text-xl">🪙</span> ¿Cómo funcionan los AloCoins?
                </h3>
                <ul className="text-sm space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span>
                    Compra AloCoins una vez y úsalos para participar en todos los Drops
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span>
                    Sin comisiones adicionales al pagar con tu saldo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span>
                    Transacciones instantáneas y seguras
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span>
                    Gana AloCoins extra con referidos y promociones
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'recharge' && (
            <div className="space-y-6">
              {/* Saldo compacto arriba de las opciones de recarga */}
              <WalletBalance showRefreshButton={true} compact={true} />
              <RechargeOptions />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <TransactionHistory />
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <Earnings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
