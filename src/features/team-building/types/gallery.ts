export type GenerationValue = '25-26' | '24-25' | '23-24' | '22-23';
// 나머지 두개 기수는 이전 기수로 처리 예정
export type GenerationTab = '전체' | '25-26' | '24-25' | '이전 기수';

export type ServiceStatus = 'IN_SERVICE' | 'NOT_IN_SERVICE';

export type MemberRole = 'LEADER' | 'MEMBER';

export type Part = 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';

/** 갤러리 목록 카드에서 사용하는 도메인 타입 */
export type ProjectGalleryListItem = {
  id: number; // galleryProjectId
  title: string; // projectName
  generation: GenerationValue; // 서버에서 내려주는 generation
  description: string; // shortDescription
  status: ServiceStatus; // serviceStatus
  thumbnailUrl: string | null;
};

export type ProjectMember = {
  userId: number;
  memberRole: MemberRole;
  name: string;
  part: Part;
};

export type ProjectDetailMember = ProjectMemberBase & {
  memberRole: MemberRole;
  part: Part;
};

export type ProjectDetail = {
  id: number;
  title: string;
  generation: GenerationValue;
  shortDescription: string;
  status: ServiceStatus;
  longDescription: string;

  leader: ProjectDetailMember | null;
  members: ProjectDetailMember[];

  thumbnailUrl: string | null;
};

export type ProjectGalleryMemberSearchItem = {
  userId: number; // 현재는 "추후 넣을 예정"이라 했지만, 이제 있다고 가정
  name: string;
  school: string;
  generationAndPosition: string;
  isSelected: boolean; // “선택 여부는 프론트에서 관리”라 했지만 서버가 내려주므로 그대로 보관
};

export type ProjectGalleryMemberSearchResponse = {
  members: ProjectGalleryMemberSearchItem[];
};

/* =========================
 * Form/UI Reusable Types
 * - ProjectPostForm / MemberSelectModal / ProjectMemberRow에서 재사용
 * ========================= */
export type ProjectMemberBase = {
  userId: number;
  name: string;
  badge: string; // UI 라벨(= generationAndPosition)
  school: string;
};

// 작성/수정 폼에서 teamMembers로 쓰는 타입(파트 선택 포함)
export type TeamMember = ProjectMemberBase & {
  part: string[];
};

/* =========================
 * Upsert (Create/Update) Body Type
 * - API 구현 전이라도 프론트 payload 만들 때 타입으로 고정
 * ========================= */
export type ProjectGalleryUpsertBody = {
  projectName: string;
  generation: GenerationValue;
  shortDescription: string;
  serviceStatus: ServiceStatus;
  description: string;
  leader: { userId: number; part: Part };
  members: Array<{ userId: number; part: Part }>;
  thumbnailUrl?: string | null;
};

export type CreateProjectGalleryResponseDto = {
  galleryProjectId: number;
};

// 팀장(내 정보) 조회 응답(도메인) - ProjectPostForm에서 그대로 사용 가능
export type ProjectGalleryLeaderProfile = ProjectMemberBase;

// (선택) 명시적으로 응답 DTO도 만들고 싶다면:
export type GetProjectGalleryLeaderProfileResponseDto = {
  userId: number;
  name: string;
  school: string;
  generationAndPosition: string; // 서버 필드
};

export type UpdateProjectGalleryResponseDto = CreateProjectGalleryResponseDto;
