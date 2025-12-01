import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRafflesList } from '../../../hooks/useRaffles';
import { RaffleCard } from '../components/RaffleCard';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Search, Sparkles } from 'lucide-react';
import type { RaffleFilters } from '../../../types/raffle';

export function RafflesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const [filters, setFilters] = useState<RaffleFilters>({
    page: 1,
    page_size: 12,
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as RaffleFilters['status']) || undefined,
  });

  const { data, isLoading, error } = useRafflesList(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
    if (searchInput) {
      searchParams.set('search', searchInput);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleStatusFilter = (status?: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as RaffleFilters['status'],
      page: 1,
    }));
    if (status) {
      searchParams.set('status', status);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-medium mb-2">
          Error al cargar Drops
        </p>
        <p className="text-sm text-neutral-400">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Explorar Drops
        </h1>
        <p className="text-neutral-400 mt-2">
          Descubre y participa en Drops activos
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-12 pr-4 py-3 border border-dark-lighter rounded-xl bg-dark text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setFilters((prev) => ({ ...prev, search: undefined, page: 1 }));
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Status Filters */}
          <div>
            <p className="text-sm font-medium text-neutral-300 mb-3">
              Filtrar por estado:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter(undefined)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !filters.status
                    ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                    : 'bg-dark-lighter text-neutral-300 hover:text-white hover:border-gold/30 border border-transparent'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center ${
                  filters.status === 'active'
                    ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                    : 'bg-dark-lighter text-neutral-300 hover:text-white hover:border-gold/30 border border-transparent'
                }`}
              >
                <span className="inline-block w-2 h-2 bg-accent-green rounded-full mr-2"></span>
                Activos
              </button>
              <button
                onClick={() => handleStatusFilter('completed')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filters.status === 'completed'
                    ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                    : 'bg-dark-lighter text-neutral-300 hover:text-white hover:border-gold/30 border border-transparent'
                }`}
              >
                Completados
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            {data.pagination.total === 0
              ? 'No se encontraron Drops'
              : `${data.pagination.total} ${data.pagination.total === 1 ? 'Drop encontrado' : 'Drops encontrados'}`}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingSpinner text="Cargando Drops..." />}

      {/* Results Grid */}
      {!isLoading && data && (
        <>
          {data.raffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.raffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-card rounded-xl border border-dark-lighter p-8">
              <EmptyState
                icon={<Sparkles className="w-12 h-12 text-gold" />}
                title="No se encontraron Drops"
                description={
                  filters.search || filters.status
                    ? 'Intenta cambiar los filtros de búsqueda'
                    : 'No hay Drops disponibles en este momento'
                }
                action={
                  filters.search || filters.status
                    ? {
                        label: 'Limpiar Filtros',
                        onClick: () => {
                          setSearchInput('');
                          setFilters({ page: 1, page_size: 12 });
                          setSearchParams({});
                        },
                      }
                    : undefined
                }
              />
            </div>
          )}

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-2 hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, data.pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (data.pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (data.pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (data.pagination.page >= data.pagination.total_pages - 2) {
                    pageNum = data.pagination.total_pages - 4 + i;
                  } else {
                    pageNum = data.pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                        data.pagination.page === pageNum
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                          : 'bg-dark-lighter text-neutral-300 hover:text-white hover:border-gold/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page === data.pagination.total_pages}
              >
                <span className="mr-2 hidden sm:inline">Siguiente</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
