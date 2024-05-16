import { apiRoutes } from '@/constants/routes';
import { GoogleAuthSchema, LoginSchema, RegisterSchema, User } from '@/types/auth';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import { toast } from 'sonner';

export class AuthService {
  static login = errorHandler(async (body: LoginSchema) => {
    const { data } = await api.post(apiRoutes.account.login, body);
    return data as { token: string };
  });

  static register = errorHandler(async (body: RegisterSchema) => {
    const { data } = await api.post(apiRoutes.account.register, body);
    return data as { token: string };
  });
  static googleAuth = errorHandler(async (body: GoogleAuthSchema) => {
    const { data } = await api.post(apiRoutes.account.googleAuth, body);
    return data;
  });
  static getUserByEmail = async (email: string, showToast?: boolean) => {
    try {
      const { data } = await api.get(apiRoutes.account.findByEmail(email));
      return data as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (showToast && typeof error.response?.data == 'string') {
          toast.error(error.response?.data);
        }
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    }
  };
  static getUserInfoFromAccessToken = errorHandler(async (token: string) => {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  });
}
