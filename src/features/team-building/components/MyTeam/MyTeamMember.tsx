import Image from 'next/image';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import crownIcon from '../../assets/crown.svg';
import externalIcon from '../../assets/external.svg';
import DeleteIcon from '../../assets/memberDelete.svg';

export type MyTeamMemberVariant = 'leader' | 'managedMember' | 'member';

type MyTeamMemberCardProps = {
  variant: MyTeamMemberVariant;
  name: string;
  onClickCard?: () => void;
  /** 팀장의 입장에서 팀원 삭제 버튼 클릭 ('managedMember') */
  onClickRemove?: () => void;
  /** 상위에서 넘기는 width 조절 */
  width?: string | number;
};

export default function MyTeamMemberCard({
  variant,
  name,
  onClickCard,
  onClickRemove,
  width = '100%',
}: MyTeamMemberCardProps) {
  const isLeader = variant === 'leader';
  const isManagedMember = variant === 'managedMember';

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

          <span css={externalIconWrapCss}>
            <Image src={externalIcon} alt="프로필 보기" width={9} height={9} />
          </span>
        </div>
      </div>

      {/* 팀장의 입장에서 팀원 카드일 때만 삭제 버튼 노출 */}
      {isManagedMember && (
        <button
          type="button"
          css={removeBtnCss}
          onClick={e => {
            e.stopPropagation();
            onClickRemove?.();
          }}
        >
          <Image src={DeleteIcon} alt="팀원 삭제" width={18} height={18} />
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

  &:hover {
    text-decoration: underline;
    color: ${colors.primary[600]};
    cursor: pointer;
  }
`;

const externalIconWrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
`;

const removeBtnCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  background-color: ${colors.white};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${colors.grayscale[200]};
  }
`;
