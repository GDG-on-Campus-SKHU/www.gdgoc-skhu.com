import {
  CancelEnrollmentParams,
  DetermineEnrollmentParams,
  EnrollmentReadability,
  EnrollmentReadabilityDto,
  EnrollmentScheduleType,
  GetReceivedEnrollmentsResponseDto,
  GetSentEnrollmentsResponseDto,
  ReceivedEnrollmentDto,
  ReceivedEnrollmentsData,
  SentEnrollmentDto,
  SentEnrollmentsData,
} from '@/features/team-building/types/applyStatusData';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import type {
  CurrentTeamData,
  CurrentTeamMemberDto,
  CurrentTeamRosterDto,
  GetCurrentTeamResponseDto,
  RemoveTeamMemberParams,
} from '../features/team-building/types/currentTeamData';
import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const myTeamKeys = {
  all: ['myTeam'] as const,
  current: () => [...myTeamKeys.all, 'current'] as const,

  // 조회 가능 여부(팀장/팀원 공통): /enrollments/sent/readabilities
  enrollmentReadabilities: () => [...myTeamKeys.all, 'enrollments', 'readabilities'] as const,

  // 팀장: 받은 지원 현황
  receivedEnrollments: (scheduleType: EnrollmentScheduleType) =>
    [...myTeamKeys.all, 'enrollments', 'received', scheduleType] as const,

  // 팀원: 보낸 지원 현황
  sentEnrollments: (scheduleType: EnrollmentScheduleType) =>
    [...myTeamKeys.all, 'enrollments', 'sent', scheduleType] as const,

  determineEnrollment: () => [...myTeamKeys.all, 'enrollments', 'determine'] as const,

  cancelEnrollment: () => [...myTeamKeys.all, 'enrollments', 'cancel'] as const,

  removeTeamMember: () => [...myTeamKeys.all, 'ideas', 'members', 'remove'] as const,
};

/* =========================================================
 * Mapper (DTO -> Domain)
 * ======================================================= */
function mapMemberDto(dto: CurrentTeamMemberDto) {
  return {
    userId: dto.userId,
    memberName: dto.memberName,
    memberRole: dto.memberRole,
    confirmed: dto.confirmed,
  };
}

function mapRosterDto(dto: CurrentTeamRosterDto) {
  return {
    part: dto.part,
    currentMemberCount: dto.currentMemberCount,
    maxMemberCount: dto.maxMemberCount,
    members: (dto.members ?? []).map(mapMemberDto),
  };
}

function mapCurrentTeamDtoToDomain(dto: GetCurrentTeamResponseDto): CurrentTeamData {
  return {
    ideaId: dto.ideaId,
    ideaTitle: dto.ideaTitle,
    ideaIntroduction: dto.ideaIntroduction,
    myRole: dto.myRole,
    rosters: (dto.rosters ?? []).map(mapRosterDto),
  };
}

function mapReceivedEnrollmentDto(dto: ReceivedEnrollmentDto) {
  return {
    enrollmentId: dto.enrollmentId,
    choice: dto.choice,
    enrollmentStatus: dto.enrollmentStatus,
    enrollmentAcceptable: dto.enrollmentAcceptable,
    applicantId: dto.applicantId,
    applicantName: dto.applicantName,
    applicantPart: dto.applicantPart,
    applicantSchool: dto.applicantSchool,
  };
}

function mapReceivedEnrollmentsDtoToDomain(
  dto: GetReceivedEnrollmentsResponseDto
): ReceivedEnrollmentsData {
  return {
    scheduleEnded: dto.scheduleEnded,
    enrollments: (dto.enrollments ?? []).map(mapReceivedEnrollmentDto),
  };
}

function mapSentEnrollmentDto(dto: SentEnrollmentDto) {
  return {
    enrollmentId: dto.enrollmentId,
    ideaId: dto.ideaId,

    choice: dto.choice,
    enrollmentStatus: dto.enrollmentStatus,

    // sent 응답에는 ideaTitle/ideaIntroduction/정원 정보 등이 있을 수 있음(스웨거 기준)
    ideaTitle: dto.ideaTitle,
    ideaIntroduction: dto.ideaIntroduction,
    enrollmentPart: dto.enrollmentPart,
    maxMemberCountOfPart: dto.maxMemberCountOfPart,
    applicantCount: dto.applicantCount,
  };
}

function mapSentEnrollmentsDtoToDomain(dto: GetSentEnrollmentsResponseDto): SentEnrollmentsData {
  return {
    scheduleEnded: dto.scheduleEnded,
    enrollments: (dto.enrollments ?? []).map(mapSentEnrollmentDto),
  };
}

function mapReadabilityDto(dto: EnrollmentReadabilityDto): EnrollmentReadability {
  return { scheduleType: dto.scheduleType, readable: dto.readable };
}

/* =========================================================
 * API: Current Team (팀원 구성 조회)
 * ======================================================= */
export async function fetchCurrentTeam(): Promise<CurrentTeamData | null> {
  try {
    const res = await api.get<GetCurrentTeamResponseDto>('/ideas/roster');
    return mapCurrentTeamDtoToDomain(res.data);
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export function useCurrentTeam(
  options?: Omit<UseQueryOptions<CurrentTeamData | null, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<CurrentTeamData | null, Error>({
    queryKey: myTeamKeys.current(),
    queryFn: fetchCurrentTeam,
    staleTime: 1000 * 60,
    ...options,
  });
}

/* =========================================================
 * API: Received Enrollments (팀장 - 받은 지원 내역 현황)
 * ======================================================= */
export async function fetchReceivedEnrollments(
  scheduleType: EnrollmentScheduleType
): Promise<ReceivedEnrollmentsData> {
  const res = await api.get<GetReceivedEnrollmentsResponseDto>('/enrollments/received', {
    params: { scheduleType },
  });
  return mapReceivedEnrollmentsDtoToDomain(res.data);
}

export function useReceivedEnrollments(
  scheduleType: EnrollmentScheduleType,
  options?: Omit<UseQueryOptions<ReceivedEnrollmentsData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ReceivedEnrollmentsData, Error>({
    queryKey: myTeamKeys.receivedEnrollments(scheduleType),
    queryFn: () => fetchReceivedEnrollments(scheduleType),
    enabled: Boolean(scheduleType),
    staleTime: 1000 * 30,
    ...options,
  });
}

/* =========================================================
 * API: Enrollment Readabilities (지원 현황 메뉴 접근 가능 여부)
 * ======================================================= */
export async function fetchEnrollmentReadabilities(): Promise<EnrollmentReadability[]> {
  const res = await api.get<EnrollmentReadabilityDto[]>('/enrollments/sent/readabilities');
  return (res.data ?? []).map(mapReadabilityDto);
}

export function useEnrollmentReadabilities(
  options?: Omit<UseQueryOptions<EnrollmentReadability[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<EnrollmentReadability[], Error>({
    queryKey: myTeamKeys.enrollmentReadabilities(),
    queryFn: fetchEnrollmentReadabilities,
    staleTime: 1000 * 30,
    ...options,
  });
}

/* =========================================================
 * API: Sent Enrollments (팀원 - 보낸 지원 내역 현황)
 * ======================================================= */
export async function fetchSentEnrollments(
  scheduleType: EnrollmentScheduleType
): Promise<SentEnrollmentsData> {
  const res = await api.get<GetSentEnrollmentsResponseDto>('/enrollments/sent', {
    params: { scheduleType },
  });
  return mapSentEnrollmentsDtoToDomain(res.data);
}

export function useSentEnrollments(
  scheduleType: EnrollmentScheduleType,
  options?: Omit<UseQueryOptions<SentEnrollmentsData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<SentEnrollmentsData, Error>({
    queryKey: myTeamKeys.sentEnrollments(scheduleType),
    queryFn: () => fetchSentEnrollments(scheduleType),
    staleTime: 1000 * 30,
    enabled: !!scheduleType,
    ...options, // options.enabled로 제어 가능
  });
}

/* =========================================================
 * API: Determine Enrollment (팀장 - 지원 수락/거절)
 * ======================================================= */
export async function determineEnrollment(params: DetermineEnrollmentParams): Promise<void> {
  const { enrollmentId, body } = params;
  await api.post(`/enrollments/${enrollmentId}/determine`, body);
}

export function useDetermineEnrollment(
  options?: UseMutationOptions<void, Error, DetermineEnrollmentParams>
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation<void, Error, DetermineEnrollmentParams>({
    mutationKey: myTeamKeys.determineEnrollment(),
    mutationFn: determineEnrollment,

    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: myTeamKeys.all });
      qc.invalidateQueries({ queryKey: myTeamKeys.current() });

      if (userOnSuccess) (userOnSuccess as any)(data, variables, undefined, context);
    },

    ...restOptions,
  });
}

/* =========================================================
 * API: 지원취소
 * ======================================================= */

export async function cancelEnrollment(params: CancelEnrollmentParams): Promise<void> {
  const { enrollmentId } = params;
  await api.delete(`/enrollments/${enrollmentId}`);
}

export function useCancelEnrollment(
  options?: UseMutationOptions<void, Error, CancelEnrollmentParams>
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation<void, Error, CancelEnrollmentParams>({
    mutationKey: myTeamKeys.cancelEnrollment(),
    mutationFn: cancelEnrollment,

    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: myTeamKeys.all });

      if (userOnSuccess) (userOnSuccess as any)(data, variables, undefined, context);
    },

    ...restOptions,
  });
}

/* =========================================================
 * API: 팀원 삭제 (팀장만)
 * ======================================================= */
export async function removeTeamMember(params: RemoveTeamMemberParams): Promise<void> {
  const { ideaId, memberId } = params;
  await api.delete(`/ideas/${ideaId}/members/${memberId}`);
}

export function useRemoveTeamMember(
  options?: UseMutationOptions<void, Error, RemoveTeamMemberParams>
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation<void, Error, RemoveTeamMemberParams>({
    mutationKey: myTeamKeys.removeTeamMember(),
    mutationFn: removeTeamMember,

    onSuccess: (data, variables, context) => {
      // 삭제 후 팀원구성/전체 관련 데이터 갱신
      qc.invalidateQueries({ queryKey: myTeamKeys.current() });
      qc.invalidateQueries({ queryKey: myTeamKeys.all });

      if (userOnSuccess) (userOnSuccess as any)(data, variables, undefined, context);
    },

    ...restOptions,
  });
}
