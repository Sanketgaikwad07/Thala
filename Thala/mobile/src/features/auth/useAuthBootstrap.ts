import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { getAccessToken } from '@/utils/tokenStorage';
import { getMe } from '@/api/users';
import { setUnauthenticated, setUser } from './authSlice';
import { setUnauthorizedHandler } from '@/api/client';

/** Restores the session on app launch and wires the axios 401 handler to Redux. */
export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setUnauthorizedHandler(() => dispatch(setUnauthenticated()));

    (async () => {
      const token = await getAccessToken();
      if (!token) {
        dispatch(setUnauthenticated());
        return;
      }
      try {
        const user = await getMe();
        dispatch(setUser(user));
      } catch {
        dispatch(setUnauthenticated());
      }
    })();
  }, [dispatch]);
}
