import { useState } from 'react';

type UserCredentials = {
  email: string;
  password: string;
};

export const useCredentials = (initialEmail = '', initialPassword = '') => {
  const [state, setState] = useState<UserCredentials>({
    email: initialEmail,
    password: initialPassword,
  });

  const setCredentials = (update: Partial<UserCredentials>) => {
    setState((prevState) => ({ ...prevState, ...update }));
  };

  return [state.email, state.password, setCredentials] as const;
}
