import { apiRoutes } from '@/constants/routes';
import { User } from '@/types/auth';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';

export class UserService {
  static getUserById = errorHandler(async (id: string) => {
    const { data } = await api.get(apiRoutes.user.getById(id));
    return data as User;
  });
  static updateUser = errorHandler(async (user: User) => {
    const { data } = await api.put(apiRoutes.user.update, user);
    return data;
  });
  static deleteUser = errorHandler(async () => {
    await api.delete(apiRoutes.user.delete);
    return true;
  });
}
