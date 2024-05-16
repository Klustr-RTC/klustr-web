import { User } from '@/types/auth';
import { create } from 'zustand';

type Store = {
  userInfo: User | null;
  setUserInfo: (user: User) => void;
};

const useKlustrStore = create<Store>(set => ({
  userInfo: null,
  setUserInfo: user => set({ userInfo: user })
}));

export default useKlustrStore;
