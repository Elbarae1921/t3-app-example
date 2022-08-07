// withAuth hoc
import React, { useState, type ComponentType } from 'react';
import { useEffect } from 'react';
import { trpc } from '../utils/trpc';
import router from 'next/router';
import { Loading } from '../components/loading';

export const withAuth = <T extends Object>(Component: ComponentType<T>, isLoginPage?: boolean) => {
  const WrappedComponent = (hocProps: T) => {
    const [redirectLoading, setRedirectLoading] = useState(true);
    const { data, isLoading, error } = trpc.useQuery(['auth.me']);

    useEffect(() => {
      if (!data?.email && !isLoading) {
        if (!isLoginPage) {
          router.push('/login').then(() => setRedirectLoading(false));
        } else {
          setRedirectLoading(false);
        }
      }

      if (data?.email && !isLoading) {
        if (isLoginPage) {
          router.push('/').then(() => setRedirectLoading(false));
        } else {
          setRedirectLoading(false);
        }
      }
    }, [data, isLoading]);

    return error ? (
      <div>AuthError: {error.message}</div>
    ) : isLoading || redirectLoading ? (
      <Loading />
    ) : (
      <Component {...hocProps} user={data || null} />
    );
  };
  return WrappedComponent;
};
