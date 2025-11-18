import { css } from '@emotion/react';
import Button from '../Button';
import Badge from './Badge';
import { colors } from '../../../../styles/constants';

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
            height: '48px',
            fontSize: '16px',
            fontWeight: 600,
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
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[300]};
  background: #ffffff;
  gap: 16px;
`;

const infoCss = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const nameRowCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const nameCss = css`
  font-size: 18px;
  font-weight: 700;
`;

const schoolCss = css`
  font-size: 14px;
  color: #979ca5;
`;

const buttonWrapCss = css`
  width: 180px;
`;
