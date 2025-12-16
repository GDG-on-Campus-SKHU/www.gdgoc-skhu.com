// 줄이 상당히 길어 추후 분리할 예정

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useProjectGalleryLeaderProfile } from '@/lib/projectGallery.api';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import {
  GenerationTab,
  GenerationValue,
  Part,
  ProjectGalleryUpsertBody,
  ProjectMemberBase,
} from '../../types/gallery';
import Button from '../Button';
import Field from '../Field';
import Modal from '../Modal_Fix';
import Radio from '../Radio_Fix';
import SelectBoxBasic from '../SelectBoxBasic_Fix';
import MemberSelectModal, { Member } from './MemberSelectModal';
import ProjectDescriptionEditor from './ProjectDescriptionEditor';
import ProjectMemberRow from './ProjectMemberRow';

// 기수 / 파트 옵션
const GENERATION_TABS: GenerationTab[] = ['25-26', '24-25', '이전 기수'];

const PART_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드 (웹)',
  '프론트엔드 (모바일)',
  '백엔드',
  'AI/ML',
] as const;

type PartLabel = (typeof PART_OPTIONS)[number];

// 폼에서 사용하는 팀원 타입 (파트 정보 포함)
export type TeamMember = ProjectMemberBase & {
  part: string[];
};

const TITLE_MAX = 20;
const ONE_LINER_MAX = 30;

// ProjectPostForm 에서 쓸 초기값 타입
export type ProjectPostFormValues = {
  title?: string;
  oneLiner?: string;
  generation?: string;
  leader?: ProjectMemberBase;
  leaderPart?: PartLabel;
  serviceStatus?: 'IN_SERVICE' | 'NOT_IN_SERVICE';
  description?: string;
  teamMembers?: TeamMember[];
  thumbnailUrl?: string | null;
};

export type ProjectPostFormInitialValues = Partial<ProjectPostFormValues>;

type Props = {
  initialValues?: ProjectPostFormInitialValues;
  isEditMode?: boolean;

  // 작성/수정 페이지에서 실제 API 연결할 때 사용할 포인트
  onSubmit?: (
    body: ProjectGalleryUpsertBody
  ) => Promise<{ galleryProjectId: number }> | { galleryProjectId: number };

  isSubmitting?: boolean;
  submitError?: Error | null;

  // 추후 인증 붙으면 leader를 외부에서 내려주는 방식으로도 쉽게 전환 가능
  defaultLeader?: ProjectMemberBase;
};

function labelToPart(label: string): Part {
  switch (label) {
    case '기획':
      return 'PM';
    case '디자인':
      return 'DESIGN';
    case '프론트엔드 (웹)':
      return 'WEB';
    case '프론트엔드 (모바일)':
      return 'MOBILE';
    case '백엔드':
      return 'BACKEND';
    case 'AI/ML':
      return 'AI';
    default:
      return label as Part;
  }
}

function tabToGenerationValue(tab: GenerationTab): GenerationValue {
  if (tab === '25-26') return '25-26';
  if (tab === '24-25') return '24-25';
  return '23-24';
}

/** initialValues가 들어왔을 때 state 리셋을 1회만 하도록 하는 키 */
function getInitKey(v?: ProjectPostFormInitialValues) {
  return [
    v?.title ?? '',
    v?.oneLiner ?? '',
    v?.generation ?? '',
    v?.leader?.userId ?? 0,
    v?.leaderPart ?? '',
    v?.serviceStatus ?? '',
    v?.description ?? '',
    (v?.teamMembers ?? []).map(m => `${m.userId}:${m.part?.[0] ?? ''}`).join('|'),
    v?.thumbnailUrl ?? '',
  ].join('::');
}

export default function ProjectPostForm({
  initialValues,
  isEditMode = false,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  defaultLeader,
}: Props) {
  const router = useRouter();

  const hasLeader = !!initialValues?.leader?.userId || !!defaultLeader?.userId;

  const { data: myProfile } = useProjectGalleryLeaderProfile({
    enabled: !hasLeader, // 수정 페이지도 잘 되는지 확인
    retry: false,
  });

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [oneLiner, setOneLiner] = useState(initialValues?.oneLiner ?? '');
  const [generation, setGeneration] = useState<string[]>(
    initialValues?.generation ? [initialValues.generation] : []
  );
  const [leader, setLeader] = useState<ProjectMemberBase>(
    initialValues?.leader ??
      defaultLeader ?? {
        userId: 0,
        name: '임시 유저',
        badge: '불러오는 중...',
        school: '성공회대학교',
      }
  );
  const [leaderPart, setLeaderPart] = useState<string[]>(
    initialValues?.leaderPart ? [initialValues.leaderPart] : []
  );
  const [serviceStatus, setServiceStatus] = useState<'IN_SERVICE' | 'NOT_IN_SERVICE'>(
    initialValues?.serviceStatus ?? 'NOT_IN_SERVICE'
  );
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialValues?.teamMembers ?? []);
  const [description, setDescription] = useState(initialValues?.description ?? '');

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const initKey = useMemo(() => getInitKey(initialValues), [initialValues]);
  const appliedInitKeyRef = useRef<string>('');

  useEffect(() => {
    if (!initialValues) return;

    // 같은 initialValues로는 반복 적용 방지
    if (appliedInitKeyRef.current === initKey) return;

    // 초기값이 "아직 비어있는 상태"면 적용하지 않음(수정페이지에서 detail 로딩 전 {})
    const hasMeaningfulData =
      !!initialValues.title ||
      !!initialValues.oneLiner ||
      !!initialValues.generation ||
      !!initialValues.description ||
      !!initialValues.leader?.userId ||
      (initialValues.teamMembers?.length ?? 0) > 0;

    if (!hasMeaningfulData) return;

    //  여기서 폼을 initialValues로 리셋
    setTitle(initialValues.title ?? '');
    setOneLiner(initialValues.oneLiner ?? '');
    setGeneration(initialValues.generation ? [initialValues.generation] : []);
    setLeader(
      initialValues.leader ??
        defaultLeader ?? {
          userId: 0,
          name: '임시 유저',
          badge: '불러오는 중...',
          school: '성공회대학교',
        }
    );
    setLeaderPart(initialValues.leaderPart ? [initialValues.leaderPart] : []);
    setServiceStatus(initialValues.serviceStatus ?? 'NOT_IN_SERVICE');
    setTeamMembers(initialValues.teamMembers ?? []);
    setDescription(initialValues.description ?? '');

    appliedInitKeyRef.current = initKey;
  }, [initKey, initialValues, defaultLeader]);

  const isTitleMax = title.length === TITLE_MAX;
  const isOneLinerMax = oneLiner.length === ONE_LINER_MAX;

  useEffect(() => {
    if (hasLeader) return;
    if (!myProfile) return;

    setLeader({
      userId: (myProfile as any).userId,
      name: (myProfile as any).name,
      school: (myProfile as any).school,
      badge: (myProfile as any).badge ?? (myProfile as any).generationAndPosition ?? '',
    });
  }, [myProfile, hasLeader]);

  // 팀원 선택(모달) → 폼에 등록
  const handleSelectMember = (member: Member) => {
    // leader와 동일 인물 선택 방지(원하면)
    if (member.userId === leader.userId) return;

    setTeamMembers(prev => {
      if (prev.some(m => m.userId === member.userId)) return prev; // 중복 방지
      return [...prev, { ...member, part: [] }];
    });
  };

  const handleRemoveMember = (userId: number) => {
    setTeamMembers(prev => prev.filter(m => m.userId !== userId));
  };

  const handleChangeMemberPart = (userId: number, next: string[]) => {
    setTeamMembers(prev => prev.map(m => (m.userId === userId ? { ...m, part: next } : m)));
  };

  // 팀장 위임
  const handleDelegateLeader = (memberUserId: number) => {
    setTeamMembers(prevMembers => {
      const target = prevMembers.find(m => m.userId === memberUserId);
      if (!target) return prevMembers;

      const newLeader: ProjectMemberBase = {
        userId: target.userId,
        name: target.name,
        badge: target.badge,
        school: target.school,
      };

      // 기존 팀장을 팀원으로 내려보내기 (파트 포함)
      const prevLeaderAsMember: TeamMember = {
        ...leader,
        part: leaderPart,
      };

      const rest = prevMembers.filter(m => m.userId !== memberUserId && m.userId !== leader.userId);

      // state 업데이트
      setLeader(newLeader);
      setLeaderPart(target.part); // 기존 팀원 파트를 그대로 팀장 파트로 승격

      return [prevLeaderAsMember, ...rest];
    });
  };

  // 폼 유효성 체크
  const isFormValid = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    const hasOneLiner = oneLiner.trim().length > 0;

    const tab = generation[0] as GenerationTab | undefined;
    const hasGeneration = tab === '25-26' || tab === '24-25' || tab === '이전 기수';

    const hasLeaderPart = (leaderPart?.[0] ?? '').trim().length > 0;
    const hasDescription = description.trim().length > 0;

    const membersAllHavePart =
      teamMembers.length === 0 || teamMembers.every(m => (m.part?.[0] ?? '').trim().length > 0);

    return (
      hasTitle &&
      hasOneLiner &&
      hasGeneration &&
      hasLeaderPart &&
      hasDescription &&
      membersAllHavePart
    );
  }, [title, oneLiner, generation, leaderPart, teamMembers, description]);

  const handleSubmitClick = () => {
    if (!isFormValid || isSubmitting) return;
    setShowConfirmModal(true);
  };

  const buildBody = (): ProjectGalleryUpsertBody => {
    const tab = (generation[0] ?? '') as GenerationTab;
    const generationValue = tabToGenerationValue(tab);

    return {
      projectName: title.trim(),
      generation: generationValue,
      shortDescription: oneLiner.trim(),
      serviceStatus,
      description: description.trim(),
      leader: { userId: leader.userId, part: labelToPart(leaderPart[0] ?? '') },
      members: teamMembers.map(m => ({
        userId: m.userId,
        part: labelToPart(m.part?.[0] ?? ''),
      })),
      thumbnailUrl: null,
    };
  };

  const handleConfirmSubmit = async () => {
    try {
      const body = buildBody();
      if (!onSubmit) {
        setShowConfirmModal(false);
        return;
      }

      const res = await onSubmit(body);
      setShowConfirmModal(false);

      router.push(`/project-gallery/${res.galleryProjectId}`);
    } catch {
      setShowConfirmModal(false);
    }
  };

  const handlePreviewClick = () => {
    router.push({
      pathname: '/project-gallery/preview',
      query: {
        title,
        oneLiner,
        generation: generation[0] ?? '',
        leaderPart: leaderPart[0] ?? '',
        description,
        teamMembers: JSON.stringify(teamMembers),
        serviceStatus,
        leader: JSON.stringify(leader),
      },
    });
  };
  return (
    <>
      <form css={formCss} onSubmit={e => e.preventDefault()}>
        {/* 프로젝트 제목 */}
        <section css={fieldBlockCss}>
          <div css={labelRowCss}>
            <span css={labelCss}>프로젝트 제목</span>
            <span css={[counterCss, isTitleMax && counterErrorCss]}>
              {title.length}/{TITLE_MAX}
            </span>
          </div>
          <Field
            placeholder="제목을 입력해주세요."
            maxLength={TITLE_MAX}
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, TITLE_MAX))}
            error={isTitleMax}
          />
        </section>

        {/* 한 줄 소개 */}
        <section css={fieldBlockCss}>
          <div css={labelRowCss}>
            <span css={labelCss}>프로젝트 한 줄 소개</span>
            <span css={[counterCss, isOneLinerMax && counterErrorCss]}>
              {oneLiner.length}/{ONE_LINER_MAX}
            </span>
          </div>
          <Field
            placeholder="프로젝트를 간단하게 소개해주세요."
            maxLength={ONE_LINER_MAX}
            value={oneLiner}
            onChange={e => setOneLiner(e.target.value.slice(0, ONE_LINER_MAX))}
            error={isOneLinerMax}
          />
        </section>

        {/* 기수 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>기수</span>
          <div
            css={css`
              width: 100%;
              max-width: 496px;
            `}
          >
            <SelectBoxBasic
              options={GENERATION_TABS as unknown as string[]}
              placeholder="기수를 선택해주세요."
              multiple={false}
              searchable={false}
              value={generation}
              onChange={setGeneration}
            />
          </div>
        </section>

        {/* 팀장 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>팀장</span>

          <ProjectMemberRow
            isLeader
            member={leader}
            partOptions={PART_OPTIONS as unknown as string[]}
            partValue={leaderPart}
            onPartChange={setLeaderPart}
          />
        </section>

        {/* 팀원리스트 + 추가 버튼 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>팀원</span>

          {/* 선택된 팀원 카드들 */}
          <div css={teamListCss}>
            {teamMembers.map(member => (
              <ProjectMemberRow
                key={member.userId}
                member={member}
                partOptions={PART_OPTIONS as unknown as string[]}
                partValue={member.part}
                onPartChange={next => handleChangeMemberPart(member.userId, next)}
                onRemove={() => handleRemoveMember(member.userId)}
                isEditMode={isEditMode}
                onDelegateLeader={() => handleDelegateLeader(member.userId)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            title="+ 팀원 추가"
            onClick={() => setIsTeamModalOpen(true)}
            style={{
              height: '50px',
              fontSize: '18px',
              fontWeight: '500',
              lineHeight: '28.8px',
              borderColor: colors.primary[600],
              color: colors.primary[600],
            }}
          />
        </section>

        {/* 서비스 운영 상태 */}
        <section css={statusGroupCss}>
          <span css={labelCss}>서비스 운영 상태</span>
          <div css={radioRowCss}>
            <Radio
              name="serviceStatus"
              value="IN_SERVICE"
              label="운영 중"
              checked={serviceStatus === 'IN_SERVICE'}
              onChange={() => setServiceStatus('IN_SERVICE')}
              disabled={isSubmitting}
            />

            <Radio
              name="serviceStatus"
              value="NOT_IN_SERVICE"
              label="미운영 중"
              checked={serviceStatus === 'NOT_IN_SERVICE'}
              onChange={() => setServiceStatus('NOT_IN_SERVICE')}
              disabled={isSubmitting}
            />
          </div>
        </section>

        {/* 프로젝트 설명 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>프로젝트 설명</span>
          <ProjectDescriptionEditor value={description} onChange={setDescription} />
        </section>

        {submitError && <div css={errorBoxCss}>{submitError.message}</div>}

        {/* 버튼 영역 */}
        <div css={btnRowCss}>
          <Button
            type="button"
            variant="secondary"
            title="프로젝트 미리보기"
            onClick={handlePreviewClick}
            disabled={isSubmitting}
            style={{
              height: '50px',
              fontSize: '18px',
              fontWeight: '500',
              lineHeight: '28.8px',
              borderColor: colors.primary[600],
              color: colors.primary[600],
            }}
          />
          <Button
            type="button"
            title={isSubmitting ? '전시 중...' : '프로젝트 전시하기'}
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmitClick}
            css={submitBtnCss(isFormValid && !isSubmitting)}
          />
        </div>
      </form>

      {/* 팀원 선택 모달 */}
      <MemberSelectModal
        open={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSelectMember={handleSelectMember}
        selectedMemberIds={teamMembers.map(m => m.userId)}
        leaderUserId={leader.userId}
      />

      {/* 전시 확인 모달 */}
      {showConfirmModal && (
        <Modal
          type="textConfirm"
          title="해당 프로젝트를 전시하시겠습니까?"
          message=""
          confirmText={isSubmitting ? '전시 중...' : '예'}
          cancelText="아니오"
          onClose={() => (isSubmitting ? null : setShowConfirmModal(false))}
          onConfirm={handleConfirmSubmit}
          customTitleAlign="center"
        />
      )}
    </>
  );
}

const formCss = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: ${colors.grayscale[1000]};
  margin-top: 30px;
`;

const fieldBlockCss = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const labelRowCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const labelCss = css`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
`;

const counterCss = css`
  color: ${colors.grayscale[500]};
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  word-wrap: break-word;
`;

const counterErrorCss = css`
  color: ${colors.point.red};
`;

const teamListCss = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const statusGroupCss = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 6px;
`;

const radioRowCss = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 16px;
  padding: 10px 0;
`;

const btnRowCss = css`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 616px;
  margin: 80px auto 0;
`;

const submitBtnCss = (isValid: boolean) => css`
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  background-color: ${isValid ? colors.primary[600] : colors.grayscale[300]};
  color: ${isValid ? colors.white : colors.grayscale[400]};
  cursor: ${isValid ? 'pointer' : 'not-allowed'};
  border: none;

  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  ${isValid &&
  css`
    &:hover {
      background-color: ${colors.primary[700]};
    }
  `}
`;

const errorBoxCss = css`
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${colors.grayscale[100]};
  color: ${colors.point?.red ?? colors.grayscale[800]};
`;
