import { apiRoutes } from '@/constants/routes';
import { CreateMemberType, Member, MemberWithUser } from '@/types/member';
import api from '@/utils/api';
import { errorHandler } from '@/utils/handlers';

export class MemberService {
  static getMembersByRoomId = async (roomId: string) => {
    try {
      const { data } = await api.get(apiRoutes.member.getByRoomId(roomId));
      return data as MemberWithUser[];
    } catch (error) {
      console.log(error);
    }
  };
  static createMember = errorHandler(async (body: CreateMemberType) => {
    const { data } = await api.post(apiRoutes.member.create, body);
    return data as Member;
  });
  static makeAdmin = errorHandler(async (memberId: string) => {
    const { data } = await api.put(apiRoutes.member.update(memberId), { isAdmin: true });
    return data as Member;
  });
  static removeAdmin = errorHandler(async (memberId: string) => {
    const { data } = await api.put(apiRoutes.member.update(memberId), { isAdmin: false });
    return data as Member;
  });
  static removeMember = errorHandler(async (memberId: string) => {
    const { data } = await api.delete(apiRoutes.member.delete(memberId));
    return data as string;
  });
}
