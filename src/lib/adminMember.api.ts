import { api } from './api';
import { Generation, TechStack, UserLink, MyProfile, UpdateProfileData } from './mypageProfile.api';

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface UserSummaryDto {
    users: UserSummaryItemDto[];
    pageInfo: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        };
}

interface UserSummaryItemDto {
    id: number;
    userName: string;
    email: string | null;
    generations: Generation[];
    number: string | null;
    part: string;
    school: string;
    approvalStatus: string;
}

interface UserInfoDto {
    name: string;
    email: string;
    phoneNum: string;
    approveAt: string;
    bannedAt: string;
    deletedAt: string;
    unbannedAt: string;
    status: string;
    generations: Generation[];
    school: string;
    part: string;
    banReason: string;
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
export interface UserSummary {
    id: number;
    userName: string;
    generation: string;
    school: string;
    part: string;
    position: string;
}

export interface UserInfo {
    id: number;
    name: string;
    part: string;
    email: string;
    phoneNum: string;
    approveAt: string;
    status: string;
    generations: Generation[];
    bannedAt: string;
    banReason: string;
}

export interface UpdateUserInfoData {
    generations: Generation[];
    school: string;
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

function mapUserInfoToDomain(dto: UserInfoDto, userId: number): UserInfo {
    return {
        id: userId,
        name: dto.name,
        part: dto.part,
        email: dto.email,
        phoneNum: dto.phoneNum,
        approveAt: dto.approveAt,
        status: dto.status,
        generations: dto.generations,
        bannedAt: dto.bannedAt,
        banReason: dto.banReason,
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
export async function fetchUserSummaryList() : Promise<UserSummary[]> {
    const res = await api.get<UserSummaryDto>('/admin/approved/users');
    console.log(res.data);
    return res.data.users.map(mapUserSummaryToDomain);
}

/* =========================================================
 * API: Get User Info
 * ======================================================= */
export async function fetchUserInfo(userId: number): Promise<UserInfo> {
    const res = await api.get<UserInfoDto>(`/admin/approved/${userId}`);
    return mapUserInfoToDomain(res.data, userId);
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
export async function updateUserProfile(userId: number, data: UpdateProfileData): Promise<MyProfile> {
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