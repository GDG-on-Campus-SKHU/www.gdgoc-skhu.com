import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../Button';
import Badge from './Badge';

type Member = {
  id: string;
  name: string;
  badge: string;
  school: string;
};

type MemberCardProps = {
  member: Member;
  onSelect: (member: Member) => void;
  disabledSelect?: boolean;
};

export default function MemberCard({ member, onSelect, disabledSelect = false }: MemberCardProps) {
  return (
    <div css={cardCss}>
      <div css={infoCss}>
        <div css={nameRowCss}>
          <span css={nameCss}>{member.name}</span>
          <Badge text={member.badge} />
        </div>
        <span css={schoolCss}>{member.school}</span>
      </div>

      <div css={buttonWrapCss}>
        <Button
          type="button"
          title="팀원 선택"
          disabled={disabledSelect}
          onClick={() => !disabledSelect && onSelect(member)}
          style={{
            height: '50px',
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '28.8px',
          }}
        />
      </div>
    </div>
  );
}

const cardCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[300]};
  gap: 16px;
`;

const infoCss = css`
  display: flex;
  flex-direction: column;
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
  color: ${colors.grayscale[500]};
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
`;

const buttonWrapCss = css`
  width: 200px;
`;
