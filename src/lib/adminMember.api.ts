import { api } from './api';
import { Generation, MyProfile, TechStack, UpdateProfileData, UserLink } from './mypageProfile.api';

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface UserSummaryDto {
  users: UserSummaryItemDto[];
  pageInfo: {
    pageNumber?: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface UserSummaryItemDto {
  id: number;
  userName: string;
  email: string | null;
  generations: Generation[];
  number: string | null;
  part: string;
  school: string;
  approvalStatus: string;
}

export interface UserInfoDto {
  name: string;
  email: string | null;
  phoneNum: string | null;
  approveAt: string;

  status: UserStatus;

  bannedAt: string | null;
  unbannedAt: string | null;
  deletedAt: string | null;

  banReason: string | null;

  generations: Generation[];
  school: string;
  part: string;
}

interface GetMyProfileResponse {
  userId: number;
  name: string;
  school: string;
  generations: Generation[];
  part: string;
  techStacks: TechStack[];
  userLinks: UserLink[];
  introduction: string;
}

interface BanReason {
  reason: string;
}

/* =========================================================
 * Domain Types
 * ======================================================= */
export type UserStatus = 'ACTIVE' | 'BANNED' | 'DELETED';

export interface UserSummary {
  id: number;
  userName: string;
  generation: string;
  school: string;
  part: string;
  position: string;
}

export interface UserInfo {
  name: string;
  school: string;
  part: string;
  email: string;
  phoneNum: string;
  approveAt: string;

  status: UserStatus;

  bannedAt?: string;
  unbannedAt?: string;
  deletedAt?: string;

  banReason?: string;

  generations: Generation[];
}

export interface UpdateUserInfoData {
  generations: Generation[];
  school: string;
  part: string;
}

export const partEnumToUi = (part: string) => {
  switch (part) {
    case 'DESIGN':
      return 'Design';
    case 'PM':
      return 'PM';
    case 'AI':
      return 'AI';
    case 'BACKEND':
      return 'Backend';
    case 'WEB':
      return 'Web';
    case 'ANDROID':
    case 'IOS':
    case 'MOBILE':
      return 'Mobile';
    default:
      return part; // 방어 로직
  }
};

export interface SearchedUser {
  id: number;
  name: string;
  school: string;
  generation: string;
  part: string;
}

/* =========================================================
 * utils
 * ======================================================= */
function mapUserSummaryToDomain(dto: UserSummaryItemDto): UserSummary {
  const mainGeneration = dto.generations?.find(gen => gen.isMain);

  return {
    id: dto.id,
    userName: dto.userName,
    generation: mainGeneration?.generation ?? '',
    school: dto.school,
    part: dto.part,
    position: mainGeneration?.position ?? '',
  };
}

function mapUserInfoToDomain(dto: UserInfoDto): UserInfo {
  return {
    name: dto.name,
    school: dto.school,
    part: partEnumToUi(dto.part),
    email: dto.email ?? '',
    phoneNum: dto.phoneNum ?? '',
    approveAt: dto.approveAt,
    status: dto.status,
    generations: dto.generations,
    bannedAt: dto.bannedAt ?? '',
    unbannedAt: dto.unbannedAt ?? '',
    deletedAt: dto.deletedAt ?? '',
    banReason: dto.banReason ?? '',
  };
}

function mapProfileDtoToDomain(dto: GetMyProfileResponse): MyProfile {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    generations: dto.generations ?? [],
    part: dto.part,
    techStacks: dto.techStacks ?? [],
    userLinks: dto.userLinks ?? [],
    introduction: dto.introduction ?? '',
  };
}

/* =========================================================
 * API: Get User Summary
 * ======================================================= */
export async function fetchUserSummaryList(
  page: number = 0, 
  size: number = 20
): Promise<{ users: UserSummary[]; pageInfo: any }> {
  const res = await api.get<UserSummaryDto>('/admin/approved/users', {
    params: {
      page,
      size,
      sortBy: 'id',
      order: 'ASC',
    },
  });
  
  return {
    users: res.data.users.map(mapUserSummaryToDomain),
    pageInfo: res.data.pageInfo,
  };
}

/* =========================================================
 * API: Get User Info
 * ======================================================= */
export async function fetchUserInfo(userId: number): Promise<UserInfo> {
  const res = await api.get<UserInfoDto>(`/admin/approved/${userId}`);
  return mapUserInfoToDomain(res.data);
}

/* =========================================================
 * API: Get User Profile
 * ======================================================= */
export async function fetchUserProfile(userId: number): Promise<MyProfile> {
  const res = await api.get<GetMyProfileResponse>(`/admin/approved/${userId}/profile`);
  return mapProfileDtoToDomain(res.data);
}

/* =========================================================
 * API: Update User Info
 * ======================================================= */
export async function updateUserInfo(userId: number, data: UpdateUserInfoData): Promise<void> {
  await api.patch<void>(`/admin/approved/${userId}`, data);
}

/* =========================================================
 * API: Update User Profile
 * ======================================================= */
export async function updateUserProfile(
  userId: number,
  data: UpdateProfileData
): Promise<MyProfile> {
  const res = await api.patch<GetMyProfileResponse>(`/admin/approved/${userId}/profile`, data);
  return mapProfileDtoToDomain(res.data);
}

/* =========================================================
 * API: Delete User Generation
 * ======================================================= */
export async function DeleteUserGeneration(generationId: number): Promise<void> {
  await api.delete<void>(`/admin/approved/${generationId}`);
}

/* =========================================================
 * API: Ban User
 * ======================================================= */
export async function BanUser(userId: number, data: BanReason): Promise<void> {
  await api.post<void>(`/admin/approved/ban/${userId}`, data);
}

/* =========================================================
 * API: Unban User
 * ======================================================= */
export async function UnbanUser(userId: number): Promise<void> {
  await api.post<void>(`/admin/approved/unban/${userId}`);
}

/* =========================================================
 * API: Get Searched User
 * ======================================================= */
type FetchSearchedUserParams = {
  schools?: string[];
  generation?: string;
};

export const fetchSearchedUser = async ({
  schools,
  generation,
}: FetchSearchedUserParams): Promise<SearchedUser[]> => {
  const response = await api.get('/admin/users/search', {
    params: {
      schools,
      generation,
    },
    paramsSerializer: {
      serialize: params => {
        const searchParams = new URLSearchParams();

        params.schools?.forEach((school: string) => searchParams.append('schools', school));

        if (params.generation) {
          searchParams.append('generation', params.generation);
        }

        return searchParams.toString();
      },
    },
  });

  return response.data;
};

export type ApprovalStatusParam = 'WAITING' | 'APPROVED' | 'REJECTED' | 'APPROVED,REJECTED';

export async function fetchWaitingUsers({
  page,
  size,
  order = 'DESC',
}: {
  page: number;
  size: number;
  order?: 'ASC' | 'DESC';
}): Promise<UserSummaryDto> {
  const res = await api.get<UserSummaryDto>('/admin/waiting/users', {
    params: {
      page,
      size,
      sortBy: 'id',
      order,
    },
  });

  return res.data;
}

export async function fetchDecidedUsers({
  page,
  size,
  order = 'DESC',
}: {
  page: number;
  size: number;
  order?: 'ASC' | 'DESC';
}): Promise<UserSummaryDto> {
  const res = await api.get<UserSummaryDto>('/admin/decided/users', {
    params: {
      page,
      size,
      sortBy: 'id',
      order,
    },
  });

  return res.data;
}
