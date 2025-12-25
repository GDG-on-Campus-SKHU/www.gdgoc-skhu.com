import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const mypageProfileKeys = {
  all: ['mypageProfile'] as const,
  profile: () => [...mypageProfileKeys.all, 'profile'] as const,
  userProfile: (userId: number) => [...mypageProfileKeys.all, 'userProfile', userId] as const,
  userLinkOptions: () => [...mypageProfileKeys.all, 'userLinkOptions'] as const,
  techStackOptions: () => [...mypageProfileKeys.all, 'techStackOptions'] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface GenerationDto {
  id: number;
  generation: string;
  position: string;
  isMain: boolean;
}

interface TechStackDto {
  techStackType: string;
  iconUrl: string;
}

interface UserLinkDto {
  linkType: string;
  url: string;
  iconUrl: string;
}

interface GetMyProfileResponse {
  userId: number;
  name: string;
  school: string;
  generations: GenerationDto[];
  part: string;
  techStacks: TechStackDto[];
  userLinks: UserLinkDto[];
  introduction: string;
}

interface UserLinkOptionDto {
  type: string;
  name: string;
  iconUrl: string;
}

interface TechStackOptionDto {
  code: string;
  displayName: string;
  iconUrl: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
interface _UpdateMyProfileRequest {
  techStacks: Array<{ techStackType: string }>;
  userLinks: Array<{ linkType: string; url: string }>;
  introduction: string;
}

/* =========================================================
 * Domain Types
 * ======================================================= */
export interface Generation {
  id?: number;
  generation: string;
  position: string;
  isMain: boolean;
}

export interface TechStack {
  techStackType: string;
  iconUrl: string;
}

export interface UserLink {
  linkType: LinkType;
  url: string;
}

export type LinkType =
  | 'GITHUB'
  | 'VELOG'
  | 'BLOG'
  | 'TISTORY'
  | 'YOUTUBE'
  | 'FACEBOOK'
  | 'BAEKJOON'
  | 'INSTAGRAM'
  | 'TWITTER'
  | 'X'
  | 'LINKEDIN'
  | 'NOTION'
  | 'OTHER';

export interface MyProfile {
  userId: number;
  name: string;
  school: string;
  generations: Generation[];
  part: string;
  techStacks: TechStack[];
  userLinks: UserLink[];
  introduction: string;
}

export interface UserLinkOption {
  type: LinkType;
  name: string;
  iconUrl: string;
}

export interface TechStackOption {
  code: string;
  displayName: string;
  iconUrl: string;
}

export interface UpdateProfileData {
  techStacks: Array<{ techStackType: string }>;
  userLinks: Array<{ linkType: string; url: string }>;
  introduction: string;
}

/* =========================================================
 * Utils
 * ======================================================= */
function mapProfileDtoToDomain(dto: GetMyProfileResponse): MyProfile {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    generations: dto.generations ?? [],
    part: dto.part,
    techStacks: dto.techStacks ?? [],
    userLinks: dto.userLinks.map(mapUserLinkDtoToDomain),
    introduction: dto.introduction ?? '',
  };
}

function mapUserLinkOptionDtoToDomain(dto: UserLinkOptionDto): UserLinkOption {
  return {
    type: dto.type as LinkType,
    name: dto.name,
    iconUrl: dto.iconUrl,
  };
}

function mapUserLinkDtoToDomain(dto: UserLinkDto): UserLink {
  return {
    linkType: dto.linkType as LinkType,
    url: dto.url,
  };
}

function mapTechStackOptionDtoToDomain(dto: TechStackOptionDto): TechStackOption {
  return {
    code: dto.code,
    displayName: dto.displayName,
    iconUrl: dto.iconUrl,
  };
}

/* =========================================================
 * API: Get My Profile
 * ======================================================= */
export async function fetchMyProfile(): Promise<MyProfile> {
  const res = await api.get<GetMyProfileResponse>('/mypage');
  return mapProfileDtoToDomain(res.data);
}

export function useMyProfile(
  options?: Omit<UseQueryOptions<MyProfile, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MyProfile, Error>({
    queryKey: mypageProfileKeys.profile(),
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
}

/* =========================================================
 *  API: Get Other User Profile
 * ======================================================= */
export async function fetchUserProfile(userId: number): Promise<MyProfile> {
  const res = await api.get<GetMyProfileResponse>(`/mypage/profile/${userId}`);
  return mapProfileDtoToDomain(res.data);
}

export function useUserProfile(
  userId: number | null | undefined,
  options?: Omit<UseQueryOptions<MyProfile, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MyProfile, Error>({
    queryKey:
      typeof userId === 'number'
        ? mypageProfileKeys.userProfile(userId)
        : ['mypageProfile', 'userProfile', 'disabled'],
    queryFn: () => fetchUserProfile(userId as number),
    enabled: typeof userId === 'number' && userId > 0,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/* =========================================================
 * API: Get User Link Options
 * ======================================================= */
export async function fetchUserLinkOptions(): Promise<UserLinkOption[]> {
  const res = await api.get<UserLinkOptionDto[]>('/mypage/userLinkOptions');
  return (res.data ?? []).map(mapUserLinkOptionDtoToDomain);
}

export function useUserLinkOptions(
  options?: Omit<UseQueryOptions<UserLinkOption[], Error, UserLinkOption[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserLinkOption[], Error>({
    queryKey: mypageProfileKeys.userLinkOptions(),
    queryFn: fetchUserLinkOptions,
    staleTime: 1000 * 60 * 30, // 30분 (옵션은 자주 변하지 않음)
    ...options,
  });
}

/* =========================================================
 * API: Get Tech Stack Options
 * ======================================================= */
export async function fetchTechStackOptions(): Promise<TechStackOption[]> {
  const res = await api.get<TechStackOptionDto[]>('/mypage/techStackOptions');
  return (res.data ?? []).map(mapTechStackOptionDtoToDomain);
}

export function useTechStackOptions(
  options?: Omit<UseQueryOptions<TechStackOption[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TechStackOption[], Error>({
    queryKey: mypageProfileKeys.techStackOptions(),
    queryFn: fetchTechStackOptions,
    staleTime: 1000 * 60 * 30, // 30분 (옵션은 자주 변하지 않음)
    ...options,
  });
}

/* =========================================================
 * API: Update My Profile
 * ======================================================= */
export async function updateMyProfile(data: UpdateProfileData): Promise<void> {
  await api.put<void>('/mypage', data);
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      // 프로필 업데이트 성공 시 프로필 데이터 다시 조회
      queryClient.invalidateQueries({ queryKey: mypageProfileKeys.profile() });
    },
  });
}

/* =========================================================
 * API: Delete Account (회원 탈퇴)
 * ======================================================= */
export async function deleteAccount(): Promise<void> {
  await api.delete<void>('/auth/delete');
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // 탈퇴 성공 시 모든 캐시 초기화
      queryClient.clear();
    },
  });
}
