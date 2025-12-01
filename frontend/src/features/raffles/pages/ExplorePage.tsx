import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { useRafflesList } from '@/hooks/useRaffles';
import { useCategories } from '@/hooks/useCategories';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RaffleCard } from '@/features/raffles/components/RaffleCard';
import { Search, Filter, Sparkles, TrendingUp, Zap, Clock } from 'lucide-react';
import type { RaffleFilters } from '@/types/raffle';

export const ExplorePage = () => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // Fetch active raffles with category filter
  const filters: RaffleFilters = {
    page: 1,
    page_size: 12,
    status: 'active',
    category_id: selectedCategoryId,
    exclude_mine: !!user,
  };

  const { data, isLoading, error } = useRafflesList(filters);

  const filteredRaffles = data?.raffles || [];

  const greeting = user ? (
    new Date().getHours() < 12
      ? `Buenos días, ${user.first_name || 'Usuario'}`
      : new Date().getHours() < 19
      ? `Buenas tardes, ${user.first_name || 'Usuario'}`
      : `Buenas noches, ${user.first_name || 'Usuario'}`
  ) : 'Bienvenido';

  // Construir lista de categorías con "Todos"
  const categories = [
    { id: undefined, icon: '🎯', label: 'Todos', count: filteredRaffles.length },
    ...(categoriesData || []).map(cat => ({
      id: cat.id,
      icon: cat.icon,
      label: cat.name,
      count: 0,
    })),
  ];

  const activeCount = filteredRaffles.length;

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-white">
            {greeting} <span className="inline-block animate-float">👋</span>
          </h1>
          <p className="text-lg text-neutral-400 mt-2">
            Descubre Drops exclusivos y participa para ganar increíbles premios
          </p>
        </div>
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <EmptyState
            icon={<Sparkles className="w-12 h-12 text-gold" />}
            title="Error al cargar Drops"
            description={error instanceof Error ? error.message : 'Ocurrió un error al cargar los Drops. Por favor intenta de nuevo.'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white">
          {greeting} <span className="inline-block animate-float">👋</span>
        </h1>
        <p className="text-lg text-neutral-400 mt-2">
          Descubre Drops exclusivos y participa para ganar increíbles premios
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-4 hover:border-gold/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-dark" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Drops Activos</p>
              <p className="text-2xl font-bold text-white">
                {isLoading ? '...' : activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-4 hover:border-accent-green/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Finalizan Pronto</p>
              <p className="text-2xl font-bold text-white">
                {isLoading ? '...' : '3'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-4 hover:border-accent-purple/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Nuevos Hoy</p>
              <p className="text-2xl font-bold text-white">
                {isLoading ? '...' : '5'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar Drops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-dark-lighter rounded-xl bg-dark-card text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categoriesLoading ? (
          <div className="text-sm text-neutral-500">Cargando categorías...</div>
        ) : (
          categories.map((category, index) => (
            <button
              key={category.id ?? `all-${index}`}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategoryId === category.id
                  ? 'bg-gradient-to-br from-gold to-gold-dark text-dark font-semibold shadow-lg shadow-gold/20'
                  : 'bg-dark-card text-neutral-300 border border-dark-lighter hover:border-gold/30 hover:text-white'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              {category.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  selectedCategoryId === category.id
                    ? 'bg-dark/20'
                    : 'bg-dark-lighter'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner text="Cargando Drops..." />
        </div>
      )}

      {/* Raffles Grid or Empty State */}
      {!isLoading && data && (
        <>
          {filteredRaffles.length === 0 ? (
            <div className="bg-dark-card rounded-xl border border-dark-lighter p-8">
              <EmptyState
                icon={<Sparkles className="w-12 h-12 text-gold" />}
                title="No hay Drops disponibles"
                description="No hay Drops activos en este momento. Vuelve pronto para ver nuevas oportunidades."
                action={{
                  label: "Explorar categorías",
                  onClick: () => setSelectedCategoryId(undefined)
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
