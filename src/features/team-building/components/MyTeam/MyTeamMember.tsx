import Image from 'next/image';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import crownIcon from '../../assets/crown.svg';
import externalIcon from '../../assets/external.svg';

export type MyTeamMemberVariant = 'leader' | 'managedMember' | 'member';

type MyTeamMemberCardProps = {
  userId?: number;
  myUserId?: number;
  variant: MyTeamMemberVariant;
  name: string;
  onClickCard?: () => void;
  onClickRemove?: () => void;
  width?: string | number;
};

export default function MyTeamMemberCard({
  userId,
  myUserId,
  variant,
  name,
  onClickCard,
  onClickRemove,
  width = '100%',
}: MyTeamMemberCardProps) {
  const router = useRouter();

  const isLeader = variant === 'leader';
  const isManagedMember = variant === 'managedMember';

  const handleClickExternal = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (userId === myUserId) {
      // 본인 → 내 프로필
      router.push('/mypage/profile');
    } else {
      // 다른 유저 → 타인 프로필
      router.push({
        pathname: '/profile/[userId]',
        query: { userId },
      });
    }
  };

  return (
    <div css={[baseBoxCss(width), memberBoxCss]}>
      <div css={leftButtonCss(isLeader)} onClick={onClickCard}>
        <div css={leftInfoCss}>
          {isLeader && (
            <span css={leaderIconWrapCss}>
              <Image src={crownIcon} alt="팀장" width={25} height={25} />
            </span>
          )}

          <span css={nameTextCss}>{name}</span>

          <button
            type="button"
            css={externalIconWrapCss}
            onClick={handleClickExternal}
            aria-label="프로필 보기"
          >
            <Image src={externalIcon} alt="" width={9} height={9} />
          </button>
        </div>
      </div>

      {/* 팀장의 입장에서 팀원 카드일 때만 삭제 버튼 노출 */}
      {isManagedMember && onClickRemove && (
        <button
          type="button"
          css={removeBtnCss}
          onClick={e => {
            e.stopPropagation();
            onClickRemove?.();
          }}
        >
          <Image src="/memberDelete.svg" alt="팀원 삭제" width={18} height={18} />
        </button>
      )}
    </div>
  );
}

const baseBoxCss = (width: string | number) => css`
  width: ${typeof width === 'number' ? `${width}px` : width};
  height: 80px;
  border-radius: 8px;
  box-sizing: border-box;
`;

const memberBoxCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  border: 1px solid ${colors.grayscale[400]};
  background-color: ${colors.white};
`;

const leftButtonCss = (isLeader: boolean) => css`
  flex: 1;
  height: 100%;

  display: flex;
  align-items: center;

  background: transparent;
  border: none;
  padding: 0;
  text-align: left;

  font-weight: ${isLeader ? 600 : 500};

  &:hover {
    opacity: 0.85;
  }
`;

const leftInfoCss = css`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const leaderIconWrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const nameTextCss = css`
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  }
`;

const externalIconWrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  cursor: pointer;
`;

const removeBtnCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  background-color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${colors.grayscale[200]};
  }
`;
