import { css } from '@emotion/react';
import Image from 'next/image';

import { colors } from '../../../../styles/constants';
import SelectBoxBasic from '../SelectBoxBasic_Fix';
import crown from '../../assets/crown.svg';
import delete_icon from '../../assets/delete.svg';
import Badge from './Badge';

export type ProjectMemberBase = {
  id: string;
  name: string;
  badge: string;
  school: string;
};

type ProjectMemberRowProps = {
  member: ProjectMemberBase;
  isLeader?: boolean;
  partOptions: string[];
  partValue: string[];
  onPartChange: (next: string[]) => void;
  onRemove?: () => void;
};

export default function ProjectMemberRow({
  member,
  isLeader = false,
  partOptions,
  partValue,
  onPartChange,
  onRemove,
}: ProjectMemberRowProps) {
  return (
    <div css={rowCss}>
      {/* 왼쪽: 프로필 + 뱃지 */}
      <div css={infoWrapCss}>
        <div css={textWrapCss}>
          <div css={nameRowCss}>
            <span css={nameCss}>{member.name}</span>
            {isLeader && <Image src={crown} alt="팀장" />}
            <Badge text={member.badge} />
          </div>
          <span css={schoolCss}>{member.school}</span>
        </div>
      </div>

      <div css={selectWrapCss}>
        <SelectBoxBasic
          options={partOptions}
          placeholder="파트를 선택해주세요."
          multiple={false}
          searchable={false}
          value={partValue}
          onChange={onPartChange}
        />
      </div>

      <div css={spacerWrapCss} />

      {/* 오른쪽: 파트 선택 + (팀원인 경우) 삭제 버튼 */}
      {!isLeader && onRemove && (
        <button type="button" css={removeBtnCss} onClick={onRemove} aria-label="팀원 선택 취소">
          <Image src={delete_icon} alt="삭제" />
        </button>
      )}
    </div>
  );
}

const rowCss = css`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  background: ${colors.white};
`;

const infoWrapCss = css`
  display: flex;
  align-items: center;
  min-width: 0;

  width: 320px;
  flex: 0 0 226px;
`;

const textWrapCss = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const nameRowCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const nameCss = css`
  font-size: 18px;
  font-weight: 700;
  line-height: 28.8px;
`;

const schoolCss = css`
  font-size: 14px;
  color: ${colors.grayscale[500]};
`;

const selectWrapCss = css`
  flex: 0 0 240px;
`;

const spacerWrapCss = css`
  flex: 1;
`;

const removeBtnCss = css`
  flex: 0 0 auto;
  cursor: pointer;

  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;

  &:hover {
    opacity: 0.8;
  }

  & > span {
    display: flex;
  }

  img {
    width: 24px !important;
    height: 24px !important;
  }
`;
