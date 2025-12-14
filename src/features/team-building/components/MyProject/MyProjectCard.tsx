import Link from 'next/link';
import { css } from '@emotion/react';
import React from 'react';

import { colors } from '../../../../styles/constants';
import type { MyPageProject } from '@/lib/mypageProject.api';
import { useUpdateProjectExhibit } from '@/lib/mypageProject.api';
import Toggle from '../Toggle';

type Props = { item: MyPageProject };

export default function MyProjectCard({ item }: Props) {
  const { mutate: updateExhibit, isPending } = useUpdateProjectExhibit();
  const handleToggleExhibit = (exhibited: boolean) => {
    updateExhibit(
      {
        projectId: item.projectId,
        exhibited,
      },
      {
        onSuccess: () => {
          console.log('전시 여부가 변경되었습니다.');
        },
        onError: (error) => {
          console.error('전시 여부 변경 실패:', error);
          alert('전시 여부 변경에 실패했습니다.');
        },
      }
    );
  };

  // 이미지 에러 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/gdgoc_logo.svg';
  };

  return (
    <article css={articleCss}>
      <Link href={`/project-gallery/${item.projectId}`}>
        <div css={leftSectionCss}>
          <div css={thumbFrameCss}>
            <img 
              src={item.thumbnailUrl || '/gdgoc_logo.svg'} 
              alt={item.projectName} 
              css={logoCss}
              onError={handleImageError}
            />
          </div>
        </div>
      </Link>
      
      <div css={rightSectionCss}>
        <div css={titleRowCss}>
          <div css={titleSectionCss}>
            <h3 css={titleCss}>{item.projectName}</h3>
            <p css={descCss}>{item.description}</p>
          </div>
          {item.isLeader && (
            <div css={displayStatusCss}>
              전시 여부{' '}
              <Toggle 
                checked={item.exhibited} 
                onChange={handleToggleExhibit}
                disabled={isPending}
              />
            </div>
          )}
        </div>

        <div css={infoSectionCss}>
          {/* 팀장 */}
          <div css={infoRowCss}>
            <span css={labelCss}>팀장</span>
            <div css={valueWrapperCss}>
              <span css={valueCss}>
                {item.leader.name}
                <span css={chipCss}>{item.leader.part}</span>
              </span>
            </div>
          </div>

          {/* 팀원 */}
          {item.members && item.members.length > 0 && (
            <div css={infoRowCss}>
              <span css={labelCss}>팀원</span>
              <div css={memberListCss}>
                {item.members.map((member, index) => (
                  <React.Fragment key={member.userId}>
                    <span css={memberItemCss}>
                      {member.name}
                      <span css={chipCss}>{member.part}</span>
                    </span>
                    {(index + 1) % 3 === 0 && index !== item.members.length - 1 && (
                      <div
                        css={css`
                          width: 100%;
                          height: 0;
                        `}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
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
  cursor: pointer;
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
  overflow: hidden;
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