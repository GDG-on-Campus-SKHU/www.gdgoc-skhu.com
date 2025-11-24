/** 프로젝트 상세보기 ui 폼 */
import Image from 'next/image';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import eye from '../../assets/eye.svg';
import { ProjectStatus } from '../../types/gallery';
import Button from '../Button';
import ProjectDetailDescription from './ProjectDetailDescription';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDetailMeta from './ProjectDetailMeta';

export type ProjectDetailViewProps = {
  title: string;
  description: string;
  longDescription: string;
  status?: ProjectStatus;
  generation: string;
  leader: { name: string; role?: string };
  members: Array<{ name: string; role?: string }>;
  isPreview?: boolean;
  canEdit?: boolean;
  onClickBackToForm?: () => void;
  onClickSubmit?: () => void;
  onClickEdit?: () => void;
};

export default function ProjectDetailView({
  title,
  description,
  longDescription,
  status,
  generation,
  leader,
  members,
  isPreview = false,
  canEdit = false,
  onClickBackToForm,
  onClickSubmit,
  onClickEdit,
}: ProjectDetailViewProps) {
  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 상단 타이틀 & (미리보기 배지) */}
        <h1 css={pageTitleCss}>Project Gallery</h1>

        {/* 상단: 제목 & 우측 영역(미리보기 배지 / 수정하기 버튼) */}
        <div css={topRowCss}>
          <ProjectDetailHeader title={title} subtitle={description} status={status} />

          {/* 프로젝트 미리보기  */}
          <div css={rightTopAreaCss}>
            {isPreview && (
              <div css={previewBadgeCss}>
                <span css={previewEyeCss}>
                  <Image src={eye} alt="미리보기 표시" />
                </span>
                <span>미리보기 화면입니다.</span>
              </div>
            )}

            {/* 프로젝트 상세보기 - 팀장일 경우 */}
            {!isPreview && canEdit && (
              <div css={editCss}>
                <Button
                  type="button"
                  title="수정하기"
                  onClick={onClickEdit}
                  style={{
                    paddingLeft: '70px',
                    paddingRight: '70px',
                    height: '50px',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '28.8px',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <ProjectDetailMeta generation={generation} leader={leader} members={members} />

        <ProjectDetailDescription title="프로젝트 설명" content={longDescription} />

        {/* 하단 버튼 영역 (프로젝트 미리보기) */}
        {isPreview && (
          <div css={buttonRowCss}>
            <Button
              type="button"
              variant="secondary"
              title="작성화면으로 돌아가기"
              onClick={onClickBackToForm}
              style={{
                height: '50px',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '28.8px',
                borderColor: colors.primary[600],
                color: colors.primary[600],
              }}
            />
            <Button
              type="button"
              title="프로젝트 전시하기"
              onClick={onClickSubmit}
              style={{
                height: '50px',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '28.8px',
                backgroundColor: colors.primary[600],
                color: colors.white,
                cursor: 'pointer',
                border: 'none',
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const topRowCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 20px;
`;

const pageTitleCss = css`
  margin-top: 60px;
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;
`;

const rightTopAreaCss = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const previewBadgeCss = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.point.red};

  position: relative;
  top: -18px;
`;

const editCss = css`
  position: relative;
  top: -14px;
`;

const previewEyeCss = css`
  position: relative;
  top: 0.5px;
`;

const buttonRowCss = css`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 616px;
  margin: 110px auto 0;
`;
