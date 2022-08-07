import { useEffect } from 'react';
import { trpc } from '../utils/trpc';
import router from 'next/router';

export const useAuth = () => {
  const { data, isLoading, error } = trpc.useQuery(['auth.me']);

  useEffect(() => {
    if (!data?.email && !isLoading) {
      router.push('/login');
    }
  } , [data, isLoading]);
  
  return { user: data || null, isLoading, error };
}
