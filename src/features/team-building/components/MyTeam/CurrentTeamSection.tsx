import { useState } from 'react';
import { css } from '@emotion/react';

import { CurrentTeamData, CurrentTeamMember, CurrentTeamRoster } from '../../types/currentTeamData';
import Modal from '../Modal_Fix';
import { SupportPhase } from './ApplyPeriodToggle';
import MyTeamCount from './MyTeamCount';
import MyTeamMemberCard, { MyTeamMemberVariant } from './MyTeamMember';
import MyTeamStatusCard from './MyTeamStatus';

type PartColumnProps = {
  roster: CurrentTeamRoster;
  isLeaderView: boolean;
  resultAnnouncedByPhase: Record<SupportPhase, boolean>;
  onOpenRemoveModal?: (payload: RemoveMember) => void;
};

/** 삭제 팀원 정보(모달용) */
type RemoveMember = {
  part: CurrentTeamRoster['part'];
  userId: number;
  memberName: string;
};

/** 한 멤버가 삭제 가능한지 여부 계산 */
function canRemoveMember(
  member: CurrentTeamMember,
  isLeaderView: boolean,
  _resultAnnouncedByPhase: Record<SupportPhase, boolean>
): boolean {
  // 1) 팀원이 아니면 삭제 X
  if (!isLeaderView) return false;

  // 2) 리더는 삭제 불가
  if (member.memberRole === 'CREATOR') return false;

  return true;
}

/** 각 파트 컬럼 */
function PartColumn({
  roster,
  isLeaderView,
  resultAnnouncedByPhase,
  onOpenRemoveModal,
}: PartColumnProps) {
  const { part, currentMemberCount, maxMemberCount, members } = roster;

  const isRecruiting = maxMemberCount > 0;

  return (
    <div css={partColumnCss}>
      {/* 제목 + 인원 뱃지 */}
      <div css={partHeaderCss}>
        <span css={partNameCss}>{part}</span>
        <MyTeamCount
          current={currentMemberCount}
          capacity={maxMemberCount}
          isRecruiting={isRecruiting}
        />
      </div>

      {/* 멤버 카드/빈 카드 */}
      <div css={partBodyCss}>
        {members.length > 0 ? (
          members.map(member => {
            let variant: MyTeamMemberVariant = 'member';

            // API 기준: CREATOR = 팀장
            if (member.memberRole === 'CREATOR') variant = 'leader';
            else if (isLeaderView) variant = 'managedMember';

            const removable = canRemoveMember(member, isLeaderView, resultAnnouncedByPhase);

            return (
              <MyTeamMemberCard
                key={member.userId}
                variant={variant}
                name={member.memberName}
                // 삭제 버튼은 UI만 연결(실제 삭제는 추후)
                onClickRemove={
                  removable && onOpenRemoveModal
                    ? () =>
                        onOpenRemoveModal({
                          part,
                          userId: member.userId,
                          memberName: member.memberName,
                        })
                    : undefined
                }
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

type CurrentTeamSectionProps = {
  data: CurrentTeamData;
  isLeaderView: boolean;
  resultAnnouncedByPhase: Record<SupportPhase, boolean>;
  // visibleJoinPhases?: JoinPhase[];
};

/** 현재 팀원 구성 */
export default function CurrentTeamSection({
  data,
  isLeaderView,
  resultAnnouncedByPhase,
  // visibleJoinPhases = ['first'],
}: CurrentTeamSectionProps) {
  const [removeMember, setRemoveMember] = useState<RemoveMember | null>(null);

  // 버튼 클릭 -> 모달 오픈
  const handleRemoveModal = (payload: RemoveMember) => {
    setRemoveMember(payload);
  };

  // 모달에서 실제 삭제
  const handleConfirmRemove = () => {
    if (!removeMember) return;

    setRemoveMember(null);
  };

  const handleCloseModal = () => {
    setRemoveMember(null);
  };

  return (
    <section css={sectionCss}>
      <div css={gridCss}>
        {data.rosters.map(roster => (
          <PartColumn
            key={roster.part}
            roster={roster}
            isLeaderView={isLeaderView}
            resultAnnouncedByPhase={resultAnnouncedByPhase}
            onOpenRemoveModal={handleRemoveModal}
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
