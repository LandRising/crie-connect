
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

/**
 * Hook para redirecionar usuários baseado no estado de autenticação
 * @param redirectAuthenticatedTo Rota para redirecionar se o usuário estiver autenticado
 * @param redirectUnauthenticatedTo Rota para redirecionar se o usuário não estiver autenticado
 */
export const useAutoRedirect = (
  redirectAuthenticatedTo?: string,
  redirectUnauthenticatedTo?: string
) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (user && redirectAuthenticatedTo) {
      navigate(redirectAuthenticatedTo, { replace: true });
    } else if (!user && redirectUnauthenticatedTo) {
      navigate(redirectUnauthenticatedTo, { replace: true });
    }
  }, [user, isLoading, navigate, redirectAuthenticatedTo, redirectUnauthenticatedTo]);

  return { isLoading, isAuthenticated: !!user };
};
