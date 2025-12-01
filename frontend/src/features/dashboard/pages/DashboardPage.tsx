import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const DashboardPage = () => {
  const user = useUser();
  const navigate = useNavigate();

  // Redirect to explore page (main user landing)
  useEffect(() => {
    if (user) {
      navigate('/explore', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Cargando..." />
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner text="Redirigiendo..." />
    </div>
  );
};
