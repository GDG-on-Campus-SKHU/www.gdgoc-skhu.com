import { css } from '@emotion/react';

type Member = { name: string; role?: string };

type Props = {
  leader: Member;
  members: Member[];
};

export default function ProjectDetailMeta({ leader, members }: Props) {
  return (
    <section css={wrapCss}>
      <dl css={dlCss}>
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
    </section>
  );
}

const wrapCss = css`
  margin-top: 25px;
`;
const dlCss = css`
  display: grid;
  gap: 22px;
`;
const rowCss = css`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 35px;
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
  color: #4285f4;
  border: 1px solid #4285f4;
  border-radius: 20px;
  padding: 0 8px;
`;
