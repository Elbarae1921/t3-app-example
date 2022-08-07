// login component
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ILogin } from '../server/validation/auth';
import { trpc } from '../utils/trpc';
import { withAuth } from '../HOCs/withAuth';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ILogin>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { mutateAsync } = trpc.useMutation(['auth.login']);

  const trpcContext = trpc.useContext();

  const onSubmit = useCallback(
    async (data: ILogin) => {
      setIsLoading(true);
      setError('');
      try {
        const { data: token } = await mutateAsync(data);
        if (token) {
          localStorage.setItem('token', token);
          trpcContext.invalidateQueries(['auth.me']);
        }
      } catch (error) {
        setError('Login failed');
      }
      setIsLoading(false);
    },
    [mutateAsync, trpcContext]
  );

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input placeholder="email@company.com" {...register('email')} />
        <label htmlFor="password">Password</label>
        <input placeholder="p@ssw0rd" {...register('password')} />
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Link href='/signup'>Go To Signup</Link>
    </div>
  );
};

export default withAuth(Login, true);
