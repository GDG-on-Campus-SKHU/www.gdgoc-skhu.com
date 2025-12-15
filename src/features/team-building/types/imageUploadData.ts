export type ImageDirectory = 'profile' | 'idea' | 'project' | (string & {});

export type UploadedImage = {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type UploadImageResponseDto = UploadedImage;
