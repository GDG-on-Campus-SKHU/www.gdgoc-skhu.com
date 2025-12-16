import { useState } from 'react';
import { useRemoveTeamMember } from '@/lib/myTeam.api';
import { css } from '@emotion/react';

import { CurrentTeamData, CurrentTeamMember, CurrentTeamRoster } from '../../types/currentTeamData';
import Modal from '../Modal_Fix';
import { partToLabel } from './ApplyStatusSection';
import MyTeamCount from './MyTeamCount';
import MyTeamMemberCard, { MyTeamMemberVariant } from './MyTeamMember';
import MyTeamStatusCard from './MyTeamStatus';

type PartColumnProps = {
  roster: CurrentTeamRoster;
  isLeaderView: boolean;
  onOpenRemoveModal?: (payload: RemoveMember) => void;
};

type RemoveMember = {
  part: CurrentTeamRoster['part'];
  userId: number; // memberId (팀원의 userId)
  memberName: string;
  confirmed: boolean;
};

function canRemoveMember(member: CurrentTeamMember, isLeaderView: boolean): boolean {
  if (!isLeaderView) return false; // 팀장만
  if (member.memberRole === 'CREATOR') return false; // 팀장 본인은 삭제 불가
  if (member.confirmed) return false; // 확정(true)이면 삭제 불가
  return true;
}

function PartColumn({ roster, isLeaderView, onOpenRemoveModal }: PartColumnProps) {
  const { part, currentMemberCount, maxMemberCount, members } = roster;

  const isRecruiting = maxMemberCount > 0;

  return (
    <div css={partColumnCss}>
      <div css={partHeaderCss}>
        <span css={partNameCss}>{partToLabel(part)}</span>
        <MyTeamCount
          current={currentMemberCount}
          capacity={maxMemberCount}
          isRecruiting={isRecruiting}
        />
      </div>

      <div css={partBodyCss}>
        {members.length > 0 ? (
          members.map(member => {
            let variant: MyTeamMemberVariant = 'member';
            if (member.memberRole === 'CREATOR') variant = 'leader';
            else if (isLeaderView && !member.confirmed) variant = 'managedMember';

            const removable = canRemoveMember(member, isLeaderView);

            return (
              <MyTeamMemberCard
                key={member.userId}
                variant={variant}
                name={member.memberName}
                onClickRemove={
                  removable && onOpenRemoveModal
                    ? () =>
                        onOpenRemoveModal({
                          part,
                          userId: member.userId,
                          memberName: member.memberName,
                          confirmed: member.confirmed,
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
};

export default function CurrentTeamSection({ data, isLeaderView }: CurrentTeamSectionProps) {
  const [removeMember, setRemoveMember] = useState<RemoveMember | null>(null);

  const removeMutation = useRemoveTeamMember();

  const handleRemoveModal = (payload: RemoveMember) => {
    setRemoveMember(payload);
  };

  const handleCloseModal = () => {
    if (removeMutation.isPending) return;
    setRemoveMember(null);
  };

  const handleConfirmRemove = async () => {
    if (!removeMember) return;
    if (removeMutation.isPending) return;

    try {
      await removeMutation.mutateAsync({
        ideaId: data.ideaId,
        memberId: removeMember.userId,
      });
      setRemoveMember(null);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? '팀원 삭제에 실패했습니다.');
    }
  };

  return (
    <section css={sectionCss}>
      <div css={gridCss}>
        {data.rosters.map(roster => (
          <PartColumn
            key={roster.part}
            roster={roster}
            isLeaderView={isLeaderView}
            onOpenRemoveModal={handleRemoveModal}
          />
        ))}
      </div>

      {removeMember && (
        <Modal
          type="titleConfirm"
          title={removeMember.memberName}
          message="팀원 목록에서 삭제할까요?"
          confirmText={removeMutation.isPending ? '삭제 중...' : '삭제하기'}
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
