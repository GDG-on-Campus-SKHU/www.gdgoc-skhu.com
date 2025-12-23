import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const adminActivityKeys = {
  all: ['adminActivity'] as const,
  categories: () => [...adminActivityKeys.all, 'categories'] as const,
  categoryPosts: (categoryId: number) =>
    [...adminActivityKeys.all, 'category', categoryId] as const,
  postDetail: (postId: number) => [...adminActivityKeys.all, 'post', postId] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface CategorySummaryDto {
  categoryId: number;
  count: number;
  categoryName: string;
  isPublished: boolean;
}

interface PostDto {
  id: number;
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
}

interface CategoryWithPostsDto {
  categoryId: number;
  categoryTitle: string;
  publish: boolean;
  posts: PostDto[];
}

interface CreateCategoryRequest {
  categoryName: string;
  published: boolean;
}

interface CreateCategoryResponse {
  categoryId: number;
}

interface UpdateCategoryRequest {
  categoryName: string;
  published: boolean;
}

interface CreatePostRequest {
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
}

interface UpdatePostRequest {
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
}

interface PostDetailDto {
  id: number;
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
}

/* =========================================================
 * Domain Types
 * ======================================================= */
export interface CategorySummary {
  categoryId: number;
  count: number;
  categoryName: string;
  isPublished: boolean;
}

export interface Post {
  id: number;
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
  youtubeId?: string;
}

export interface CategoryWithPosts {
  categoryId: number;
  categoryTitle: string;
  publish: boolean;
  posts: Post[];
}

export interface PostDetail {
  id: number;
  title: string;
  speaker: string;
  generation: string;
  videoUrl: string;
  youtubeId?: string;
}

/* =========================================================
 * Utils
 * ======================================================= */
function extractYoutubeId(url: string): string | undefined {
  if (!url) return undefined;

  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v') || undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function mapPostDtoToDomain(dto: PostDto): Post {
  return {
    id: dto.id,
    title: dto.title,
    speaker: dto.speaker,
    generation: dto.generation,
    videoUrl: dto.videoUrl,
    youtubeId: extractYoutubeId(dto.videoUrl),
  };
}

function mapPostDetailDtoToDomain(dto: PostDetailDto): PostDetail {
  return {
    id: dto.id,
    title: dto.title,
    speaker: dto.speaker,
    generation: dto.generation,
    videoUrl: dto.videoUrl,
    youtubeId: extractYoutubeId(dto.videoUrl),
  };
}

/* =========================================================
 * API: Category Management
 * ======================================================= */

// 카테고리 목록 조회
export async function fetchAdminCategories(): Promise<CategorySummary[]> {
  const res = await api.get<CategorySummaryDto[]>('/admin/activity');
  return (res.data ?? []).sort((a, b) => b.categoryId - a.categoryId);
}
export function useAdminCategories(
  options?: Omit<UseQueryOptions<CategorySummary[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<CategorySummary[], Error>({
    queryKey: adminActivityKeys.categories(),
    queryFn: fetchAdminCategories,
    staleTime: 1000 * 60,
    ...options,
  });
}

// 카테고리 생성
export async function createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
  const res = await api.post<CreateCategoryResponse>('/admin/activity', data);
  return res.data;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.categories() });
    },
  });
}

// 카테고리 수정
export async function updateCategory(
  categoryId: number,
  data: UpdateCategoryRequest
): Promise<void> {
  await api.patch(`/admin/activity/${categoryId}`, data);
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: UpdateCategoryRequest }) =>
      updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.categories() });
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.all });
    },
  });
}

// 카테고리 삭제
export async function deleteCategory(categoryId: number): Promise<void> {
  await api.delete(`/admin/activity/categories/${categoryId}`);
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.categories() });
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.all });
    },
  });
}

/* =========================================================
 * API: Post Management
 * ======================================================= */

// 특정 카테고리의 게시글 목록 조회
export async function fetchCategoryPosts(categoryId: number): Promise<CategoryWithPosts[]> {
  const res = await api.get<CategoryWithPostsDto[]>(`/admin/activity/${categoryId}`);
  return (res.data ?? []).map(category => ({
    categoryId: category.categoryId,
    categoryTitle: category.categoryTitle,
    publish: category.publish,
    posts: (category.posts ?? []).map(mapPostDtoToDomain),
  }));
}

export function useCategoryPosts(
  categoryId: number,
  options?: Omit<UseQueryOptions<CategoryWithPosts[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<CategoryWithPosts[], Error>({
    queryKey: adminActivityKeys.categoryPosts(categoryId),
    queryFn: () => fetchCategoryPosts(categoryId),
    enabled: Number.isFinite(categoryId) && categoryId > 0,
    staleTime: 1000 * 60,
    ...options,
  });
}

// 게시글 상세 조회
export async function fetchPostDetail(postId: number): Promise<PostDetail> {
  const res = await api.get<PostDetailDto>(`/admin/activity/detail/${postId}`);
  return mapPostDetailDtoToDomain(res.data);
}

export function usePostDetail(
  postId: number,
  options?: Omit<UseQueryOptions<PostDetail, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PostDetail, Error>({
    queryKey: adminActivityKeys.postDetail(postId),
    queryFn: () => fetchPostDetail(postId),
    enabled: Number.isFinite(postId) && postId > 0,
    staleTime: 1000 * 60,
    ...options,
  });
}

// 게시글 생성
export async function createPost(categoryId: number, data: CreatePostRequest): Promise<void> {
  await api.post(`/admin/activity/${categoryId}`, data);
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: CreatePostRequest }) =>
      createPost(categoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminActivityKeys.categoryPosts(variables.categoryId),
      });
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.categories() });
    },
  });
}

// 게시글 수정
export async function updatePost(postId: number, data: UpdatePostRequest): Promise<PostDetail> {
  const res = await api.put<PostDetailDto>(`/admin/activity/${postId}`, data);
  return mapPostDetailDtoToDomain(res.data);
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostRequest }) =>
      updatePost(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.postDetail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.all });
    },
  });
}

// 게시글 삭제
export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/admin/activity/${postId}`);
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminActivityKeys.all });
    },
  });
}
