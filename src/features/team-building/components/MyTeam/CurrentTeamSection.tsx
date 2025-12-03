import { useState } from 'react';
import { css } from '@emotion/react';

import { MOCK_PARTS, MyTeamMember, MyTeamPart } from '../../types/currentTeamData';
import Modal from '../Modal_Fix';
import MyTeamCount from './MyTeamCount';
import MyTeamMemberCard, { MyTeamMemberVariant } from './MyTeamMember';
import MyTeamStatusCard from './MyTeamStatus';

/** 팀원 삭제 버튼 확인용 */
const isLeader = true;

type PartColumnProps = {
  part: MyTeamPart;
  isLeaderView: boolean;
  onRemoveMember: (partId: string, member: MyTeamMember) => void;
};

/** 각 파트 컬럼 */
function PartColumn({ part, isLeaderView, onRemoveMember }: PartColumnProps) {
  const { id: partId, name, capacity, isRecruiting, members } = part;

  return (
    <div css={partColumnCss}>
      {/* 제목 + 인원 뱃지 */}
      <div css={partHeaderCss}>
        <span css={partNameCss}>{name}</span>
        <MyTeamCount current={members.length} capacity={capacity} isRecruiting={isRecruiting} />
      </div>

      {/* 멤버 카드/빈 카드 */}
      <div css={partBodyCss}>
        {members.length > 0 ? (
          members.map(member => {
            let variant: MyTeamMemberVariant = 'member';
            if (member.isLeader) variant = 'leader';
            else if (isLeaderView) variant = 'managedMember';

            const canRemove = isLeaderView && !member.isLeader;

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

/** 현재 팀원 구성 */
export default function MyTeamCurrentTeamSection() {
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
            isLeaderView={isLeader}
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
