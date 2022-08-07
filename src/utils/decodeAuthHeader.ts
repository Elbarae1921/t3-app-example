import jwt from 'jsonwebtoken';
import { ISignUp } from '../server/validation/auth';

export const decodeAuthHeader = (authHeader: string) => {
  const [, token] = authHeader.split(" ");
  if (token) {
    jwt.verify(token, 'secret' as string);
    return jwt.decode(token) as Pick<ISignUp, 'email'>;
  } else {
    return null;
  }
}
