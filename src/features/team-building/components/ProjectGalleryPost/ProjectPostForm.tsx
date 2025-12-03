import { useMemo, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../Button';
import Field from '../Field';
import Modal from '../Modal_Fix';
import Radio from '../Radio_Fix';
import SelectBoxBasic from '../SelectBoxBasic_Fix';
import MemberSelectModal, { Member } from './MemberSelectModal';
import ProjectDescriptionEditor from './ProjectDescriptionEditor';
import ProjectMemberRow, { ProjectMemberBase } from './ProjectMemberRow';

// 기수 / 파트 옵션
const GENERATION_OPTIONS = ['25-26', '24-25', '이전 기수'] as const;

const PART_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드 (웹)',
  '프론트엔드 (모바일)',
  '백엔드',
  'AI/ML',
] as const;

// 폼에서 사용하는 팀원 타입 (파트 정보 포함)
type TeamMember = ProjectMemberBase & {
  part: string[];
};

const TITLE_MAX = 20;
const ONE_LINER_MAX = 30;

export default function ProjectPostForm() {
  const [title, setTitle] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [generation, setGeneration] = useState<string[]>([]);
  const [leaderPart, setLeaderPart] = useState<string[]>([]);
  const [serviceStatus, setServiceStatus] = useState<'RUNNING' | 'PAUSED'>('PAUSED');

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [description, setDescription] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isTitleMax = title.length === TITLE_MAX;
  const isOneLinerMax = oneLiner.length === ONE_LINER_MAX;

  // 모달에서 팀원 선택 시 호출
  const handleSelectMember = (member: Member) => {
    setTeamMembers(prev => {
      if (prev.some(m => m.id === member.id)) return prev;
      return [...prev, { ...member, part: [] }];
    });
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleChangeMemberPart = (id: string, next: string[]) => {
    setTeamMembers(prev => prev.map(m => (m.id === id ? { ...m, part: next } : m)));
  };

  // 폼 유효성 체크
  const isFormValid = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    const hasOneLiner = oneLiner.trim().length > 0;
    const hasGeneration = generation.length > 0;
    const hasLeaderPart = leaderPart.length > 0;
    const hasDescription = description.trim().length > 0;

    const membersAllHavePart =
      teamMembers.length === 0 || teamMembers.every(m => m.part.some(p => p.trim().length > 0));

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
    if (!isFormValid) return;
    setShowConfirmModal(true);
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
            onChange={e => {
              const next = e.target.value.slice(0, TITLE_MAX);
              setTitle(next);
            }}
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
            onChange={e => {
              const next = e.target.value.slice(0, ONE_LINER_MAX);
              setOneLiner(next);
            }}
            error={isOneLinerMax}
          />
        </section>

        {/* 기수 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>기수</span>
          <div
            css={css`
              width: 496px;
            `}
          >
            <SelectBoxBasic
              options={GENERATION_OPTIONS as unknown as string[]}
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
            member={{
              id: 'leader-1',
              name: '주현지',
              badge: '25-26 Core',
              school: '성공회대학교',
            }}
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
                key={member.id}
                member={member}
                partOptions={PART_OPTIONS as unknown as string[]}
                partValue={member.part}
                onPartChange={next => handleChangeMemberPart(member.id, next)}
                onRemove={() => handleRemoveMember(member.id)}
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
              value="RUNNING"
              label="운영 중"
              checked={serviceStatus === 'RUNNING'}
              onChange={() => setServiceStatus('RUNNING')}
            />

            <Radio
              name="serviceStatus"
              value="PAUSED"
              label="미운영 중"
              checked={serviceStatus === 'PAUSED'}
              onChange={() => setServiceStatus('PAUSED')}
            />
          </div>
        </section>

        {/* 프로젝트 설명 */}
        <section css={fieldBlockCss}>
          <span css={labelCss}>프로젝트 설명</span>
          <ProjectDescriptionEditor value={description} onChange={setDescription} />
        </section>

        {/* 버튼 영역 */}
        <div css={btnRowCss}>
          <Button
            type="button"
            variant="secondary"
            title="프로젝트 미리보기"
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
            title="프로젝트 전시하기"
            disabled={!isFormValid}
            onClick={handleSubmitClick}
            css={submitBtnCss(isFormValid)}
          />
        </div>
      </form>

      {/* 팀원 선택 모달 */}
      <MemberSelectModal
        open={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSelectMember={handleSelectMember}
        selectedMemberIds={teamMembers.map(m => m.id)}
      />

      {/* 전시 확인 모달 */}
      {showConfirmModal && (
        <Modal
          type="textConfirm"
          title="해당 프로젝트를 전시하시겠습니까?"
          message=""
          confirmText="예"
          cancelText="아니오"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            setShowSuccessModal(true);
          }}
          customTitleAlign="center"
        />
      )}

      {/* 전시 완료 모달 */}
      {showSuccessModal && (
        <Modal
          type="textOnly"
          title="전시가 완료되었습니다."
          message=""
          buttonText="확인"
          onClose={() => setShowSuccessModal(false)}
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
  margin: 50px auto 0;
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
