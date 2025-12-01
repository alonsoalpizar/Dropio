import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

/**
 * CheckoutPage - YA NO SE USA
 *
 * El flujo de pago ahora es directo desde la grilla de números.
 * Esta página solo redirige a /explore.
 */
export function CheckoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/explore');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <LoadingSpinner text="Redirigiendo..." />
    </div>
  );
}
