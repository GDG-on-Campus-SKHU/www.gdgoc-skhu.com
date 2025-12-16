import type {
  ImageDirectory,
  UploadedImage,
  UploadImageResponseDto,
} from '@/features/team-building/types/imageUploadData';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { api } from './api';

/* =========================================================
 * Mutation Keys
 * ======================================================= */
export const imageKeys = {
  all: ['image'] as const,
  upload: (directory?: string) => [...imageKeys.all, 'upload', directory ?? '(default)'] as const,
};

export async function uploadImage(params: {
  file: File;
  directory?: ImageDirectory;
}): Promise<UploadedImage> {
  const { file, directory } = params;

  const formData = new FormData();
  formData.append('imageFile', file);

  const res = await api.post<UploadImageResponseDto>('/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: directory ? { directory } : undefined,
  });

  return res.data;
}

export function useUploadImage(
  options?: UseMutationOptions<UploadedImage, Error, { file: File; directory?: ImageDirectory }>
) {
  return useMutation<UploadedImage, Error, { file: File; directory?: ImageDirectory }>({
    mutationFn: uploadImage,
    ...options,
  });
}
