import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/models';

interface AuthState {
  user: User | null;
  status: 'idle' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUnauthenticated(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setUser, updateUser, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
