import { apiRoutes } from '@/constants/routes';
import { GoogleAuthSchema, LoginSchema, RegisterSchema } from '@/types/auth';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';

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
  static getUserByEmail = errorHandler(async (email: string) => {
    const { data } = await api.get(apiRoutes.account.findByEmail(email));
    return data;
  });
}
