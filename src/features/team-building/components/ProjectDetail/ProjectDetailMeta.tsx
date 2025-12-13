import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Badge from '../ProjectGalleryPost/Badge';
import { GenerationValue, Part } from '../../types/gallery';

type Member = { name: string; role?: Part };

type Props = {
  generation: GenerationValue;
  leader: Member;
  members: Member[];
};

export default function ProjectDetailMeta({ generation, leader, members }: Props) {
  return (
    <section css={wrapCss}>
      <dl css={dlCss}>
        <div css={rowCss}>
          <dt css={dtCss}>기수</dt>
          <dd css={ddCss}>
            <Badge
              text={generation}
              customCss={css`
                font-size: 18px;
                font-weight: 700;
                padding: 2px 8px;
                line-height: 28.8px;
              `}
            />
          </dd>
        </div>

        <dl css={dlCss1}>
          <div css={rowCss}>
            <dt css={dtCss}>팀장</dt>
            <dd css={ddCss}>
              <span css={memberCss}>
                {leader.name}
                {leader.role && <span css={chipCss}>{leader.role}</span>}
              </span>
            </dd>
          </div>

          <div css={rowCss}>
            <dt css={dtCss}>팀원</dt>
            <dd css={ddCss}>
              {members.map((m, i) => (
                <span key={i} css={memberCss}>
                  {m.name}
                  {m.role && <span css={chipCss}>{m.role}</span>}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </dl>
    </section>
  );
}

const wrapCss = css`
  margin-top: 25px;
`;
const dlCss = css`
  display: grid;
  gap: 17px;
`;
const dlCss1 = css`
  display: grid;
  gap: 23px;
`;
const rowCss = css`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 35px;
  align-items: center;
`;
const dtCss = css`
  font-size: 20px;
  font-weight: 700;
`;
const ddCss = css`
  display: flex;
  gap: 12px 16px;
  font-size: 20px;
  font-weight: 500;
`;
const memberCss = css`
  display: inline-flex;
  gap: 8px;
`;
const chipCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary[600]};
  border: 1px solid ${colors.primary[600]};
  border-radius: 20px;
  padding: 0 8px;
`;
