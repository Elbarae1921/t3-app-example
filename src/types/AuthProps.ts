import { ISignUp } from "../server/validation/auth";

export interface AuthProps {
  user: Pick<ISignUp, 'email'> | null;
}
