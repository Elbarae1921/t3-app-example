// login component
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ISignUp } from '../server/validation/auth';
import { trpc } from '../utils/trpc';
import { withAuth } from '../HOCs/withAuth';
import Link from 'next/link';

const Signup = () => {
  const { register, handleSubmit } = useForm<ISignUp>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { mutateAsync } = trpc.useMutation(['auth.signup']);

  const trpcContext = trpc.useContext();

  const onSubmit = useCallback(
    async (data: ISignUp) => {
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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input placeholder="email@company.com" {...register('email')} />
        <label htmlFor="username">Username</label>
        <input placeholder="username123" {...register('username')} />
        <label htmlFor="password">Password</label>
        <input placeholder="p@ssw0rd" {...register('password')} />
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Link href='/login'>Go To Login</Link>
    </div>
  );
};

export default withAuth(Signup, true);
