import { useState } from 'react';
import { css } from '@emotion/react';

import { JoinPhase, MOCK_PARTS, MyTeamMember, MyTeamPart } from '../../types/currentTeamData';
import Modal from '../Modal_Fix';
import { SupportPhase } from './ApplyPeriodToggle';
import MyTeamCount from './MyTeamCount';
import MyTeamMemberCard, { MyTeamMemberVariant } from './MyTeamMember';
import MyTeamStatusCard from './MyTeamStatus';

type PartColumnProps = {
  part: MyTeamPart;
  isLeaderView: boolean;
  resultAnnouncedByPhase: Record<SupportPhase, boolean>;
  visibleJoinPhases: JoinPhase[];
  onRemoveMember: (partId: string, member: MyTeamMember) => void;
};

/** 한 멤버가 삭제 가능한지 여부 계산 */
function canRemoveMember(
  member: MyTeamMember,
  isLeaderView: boolean,
  resultAnnouncedByPhase: Record<SupportPhase, boolean>
): boolean {
  // 1) 팀원이 아니면 삭제 X
  if (!isLeaderView) return false;

  // 2) 리더는 삭제 불가
  if (member.isLeader) return false;

  // 3) 어느 기간에서 합류했는지 정보가 없다면 보수적으로 삭제 불가 처리
  const phase = member.joinPhase;
  if (!phase) return false;

  // 4) 해당 기간의 결과 발표 전까지만 삭제 가능
  return !resultAnnouncedByPhase[phase];
}

/** 각 파트 컬럼 */
function PartColumn({
  part,
  isLeaderView,
  resultAnnouncedByPhase,
  visibleJoinPhases,
  onRemoveMember,
}: PartColumnProps) {
  const { id: partId, name, capacity, isRecruiting, members } = part;

  // 현재 시점에서 화면에 노출할 멤버 필터링
  const visibleMembers = members.filter(member => {
    // joinPhase가 없으면 항상 보이게 할지, first로 간주할지는 선택인데
    // 여기선 "정보 없으면 보이게"로 처리
    if (!member.joinPhase) return true;
    return visibleJoinPhases.includes(member.joinPhase);
  });

  return (
    <div css={partColumnCss}>
      {/* 제목 + 인원 뱃지 */}
      <div css={partHeaderCss}>
        <span css={partNameCss}>{name}</span>
        <MyTeamCount
          current={visibleMembers.length}
          capacity={capacity}
          isRecruiting={isRecruiting}
        />
      </div>

      {/* 멤버 카드/빈 카드 */}
      <div css={partBodyCss}>
        {visibleMembers.length > 0 ? (
          visibleMembers.map(member => {
            let variant: MyTeamMemberVariant = 'member';
            if (member.isLeader) variant = 'leader';
            else if (isLeaderView) variant = 'managedMember';

            const canRemove = canRemoveMember(member, isLeaderView, resultAnnouncedByPhase);

            return (
              <MyTeamMemberCard
                key={member.id}
                variant={variant}
                name={member.name}
                onClickRemove={canRemove ? () => onRemoveMember(partId, member) : undefined}
              />
            );
          })
        ) : (
          <MyTeamStatusCard variant={isRecruiting ? 'not-filled' : 'not-recruiting'} />
        )}
      </div>
    </div>
  );
}

/** 삭제 팀원 정보 */
type RemoveMember = {
  partId: string;
  memberId: string;
  memberName: string;
};

type MyTeamCurrentTeamSectionProps = {
  isLeaderView: boolean;
  resultAnnouncedByPhase: Record<SupportPhase, boolean>;
  visibleJoinPhases?: JoinPhase[];
};

/** 현재 팀원 구성 */
export default function MyTeamCurrentTeamSection({
  isLeaderView,
  resultAnnouncedByPhase,
  visibleJoinPhases = ['first'],
}: MyTeamCurrentTeamSectionProps) {
  const [parts, setParts] = useState<MyTeamPart[]>(MOCK_PARTS);
  const [removeMember, setRemoveMember] = useState<RemoveMember | null>(null);

  // 버튼 클릭 -> 모달 오픈
  const handleRemoveModal = (partId: string, member: MyTeamMember) => {
    setRemoveMember({
      partId,
      memberId: member.id,
      memberName: member.name,
    });
  };

  // 모달에서 실제 삭제
  const handleConfirmRemove = () => {
    if (!removeMember) return;

    const { partId, memberId } = removeMember;

    setParts(prev =>
      prev.map(part =>
        part.id === partId
          ? {
              ...part,
              members: part.members.filter(member => member.id !== memberId),
            }
          : part
      )
    );

    setRemoveMember(null);
  };

  const handleCloseModal = () => {
    setRemoveMember(null);
  };

  return (
    <section css={sectionCss}>
      <div css={gridCss}>
        {parts.map(part => (
          <PartColumn
            key={part.id}
            part={part}
            isLeaderView={isLeaderView}
            resultAnnouncedByPhase={resultAnnouncedByPhase}
            visibleJoinPhases={visibleJoinPhases}
            onRemoveMember={handleRemoveModal}
          />
        ))}
      </div>

      {/* 팀원 삭제 확인 모달 */}
      {removeMember && (
        <Modal
          type="titleConfirm"
          title={removeMember.memberName}
          message="팀원 목록에서 삭제할까요?"
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={handleConfirmRemove}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

const sectionCss = css`
  width: 100%;
  margin-top: 55px;
`;

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const partColumnCss = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 43px;
`;

const partHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const partNameCss = css`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
`;

const partBodyCss = css`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;
