import { AuthPayload } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token: string) => {
  try {
    const payload: AuthPayload = jwtDecode(token);
    return payload;
  } catch (error) {
    console.log(error);
  }
};
