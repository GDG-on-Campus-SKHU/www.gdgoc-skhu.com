import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const activityKeys = {
  all: ['activity'] as const,
  published: () => [...activityKeys.all, 'published'] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface ActivityDto {
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
}

interface ActivityCategoryDto {
  categoryId: number;
  categoryTitle: string;
  activities: ActivityDto[];
}

type GetPublishedActivitiesResponse = ActivityCategoryDto[];

/* =========================================================
 * Domain Types
 * ======================================================= */
export interface Activity {
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
  youtubeId?: string; // videoUrl에서 추출
}

export interface ActivityCategory {
  categoryId: number;
  categoryTitle: string;
  activities: Activity[];
}

/* =========================================================
 * Utils
 * ======================================================= */
/**
 * YouTube URL에서 videoId 추출
 * 예: https://www.youtube.com/watch?v=3fsY8rLvhZ4 → 3fsY8rLvhZ4
 */
function extractYoutubeId(url: string): string | undefined {
  if (!url) return undefined;

  try {
    const urlObj = new URL(url);

    // youtu.be 형식
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    // youtube.com 형식
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v') || undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function mapActivityDtoToDomain(dto: ActivityDto): Activity {
  return {
    title: dto.title,
    speaker: dto.speaker,
    generation: dto.generation,
    videoUrl: dto.videoUrl,
    youtubeId: extractYoutubeId(dto.videoUrl),
  };
}

function mapCategoryDtoToDomain(dto: ActivityCategoryDto): ActivityCategory {
  return {
    categoryId: dto.categoryId,
    categoryTitle: dto.categoryTitle,
    activities: (dto.activities ?? []).map(mapActivityDtoToDomain),
  };
}

/* =========================================================
 * API: Published Activities List
 * ======================================================= */
export async function fetchPublishedActivities(): Promise<ActivityCategory[]> {
  try {
    const res = await api.get<GetPublishedActivitiesResponse>('/activity/published');
    // categoryId 기준 내림차순 정렬 (최신순)
    return (res.data ?? [])
      .map(mapCategoryDtoToDomain)
      .sort((a, b) => b.categoryId - a.categoryId);
  } catch (error: any) {
    // 등록된 액티비티가 없는 경우 빈 배열 반환
    if (error?.response?.status === 404) return [];
    throw error;
  }
}

export function usePublishedActivities(
  options?: Omit<UseQueryOptions<ActivityCategory[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ActivityCategory[], Error>({
    queryKey: activityKeys.published(),
    queryFn: fetchPublishedActivities,
    staleTime: 1000 * 60, // 1분
    ...options,
  });
}

/* =========================================================
 * Check Video Exists
 * ======================================================= */
export async function checkYoutubeExists(youtubeId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    );
    return res.ok;
  } catch {
    return false;
  }
}