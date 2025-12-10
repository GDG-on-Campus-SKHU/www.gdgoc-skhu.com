import Link from 'next/link';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import type { Project, ProjectDetail } from '../../types/myproject';
import { getMockProjectDetailById } from '../../types/myproject';
import Toggle from '../Toggle';

type Props = { item: Project };

export default function MyProjectCard({ item }: Props) {
  const detail: ProjectDetail | null = getMockProjectDetailById(item.id);

  if (!detail) return null;

  return (
    <article css={articleCss}>
      <Link href={`/project-gallery/${item.id}`}>
        <div css={leftSectionCss}>
          <div css={thumbFrameCss}>
            <img src={item.thumbnailUrl} alt={item.title} css={logoCss} />
          </div>
        </div>
      </Link>
      <div css={rightSectionCss}>
        <div css={titleRowCss}>
          <div css={titleSectionCss}>
            <h3 css={titleCss}>{detail.title}</h3>
            <p css={descCss}>{detail.description}</p>
          </div>
          {detail.isLeader && (
            <div css={displayStatusCss}>
              전시 여부 <Toggle />
            </div>
          )}
        </div>

        <div css={infoSectionCss}>
          {/* 팀장 */}
          <div css={infoRowCss}>
            <span css={labelCss}>팀장</span>
            <div css={valueWrapperCss}>
              <span css={valueCss}>
                {detail.leader.name}
                {detail.leader.role && <span css={chipCss}>{detail.leader.role}</span>}
              </span>
            </div>
          </div>

          {/* 팀원 */}
          <div css={infoRowCss}>
            <span css={labelCss}>팀원</span>
            <div css={memberListCss}>
              {detail.members.map((member, index) => (
                <>
                  <span key={index} css={memberItemCss}>
                    {member.name}
                    {member.role && <span css={chipCss}>{member.role}</span>}
                  </span>
                  {(index + 1) % 3 === 0 && index !== detail.members.length - 1 && (
                    <div
                      css={css`
                        width: 100%;
                        height: 0;
                      `}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

const articleCss = css`
  display: flex;
  flex-direction: row;
  padding: 2.5rem 1.25rem;
  margin-top: 0.5rem;
  gap: 4.5rem;
  margin-left: 0.1rem;
  border-bottom: 1px solid ${colors.grayscale[400]};
  &:first-of-type {
    padding-top: 0;
  }

  transition: background-color 0.2s;
`;

const leftSectionCss = css`
  flex-shrink: 0;
`;

const thumbFrameCss = css`
  height: 180px;
  width: 240px;
  border-radius: 12px;
  border: 1px solid ${colors.gray900};
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const logoCss = css`
  width: 160px;
  height: 160px;
  object-fit: contain;
  display: block;
`;

const rightSectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const titleRowCss = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const titleSectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
`;

const titleCss = css`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%;
`;

const descCss = css`
  font-size: 18px;
  color: ${colors.grayscale[500]};
  font-weight: 400;
  line-height: 160%;
  margin-bottom: 1rem;
`;

const displayStatusCss = css`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.grayscale[1000]};
  white-space: nowrap;
`;

const infoSectionCss = css`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const infoRowCss = css`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const labelCss = css`
  min-width: 60px;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.grayscale[1000]};
  line-height: 160%;
  flex-shrink: 0;
`;

const valueWrapperCss = css`
  flex: 1;
`;

const valueCss = css`
  font-size: 18px;
  font-weight: 400;
  color: ${colors.grayscale[900]};
  line-height: 160%;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const memberListCss = css`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  row-gap: 0.1rem;
  align-items: center;
`;

const memberItemCss = css`
  font-size: 18px;
  font-weight: 400;
  color: ${colors.grayscale[900]};
  line-height: 160%;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const chipCss = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #4285f4;
  border: 1px solid #4285f4;
  border-radius: 20px;
  padding: 0 8px;
  height: 20px;
  white-space: nowrap;
`;
