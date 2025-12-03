import { css } from '@emotion/react';
import Button from '../Button';
import { colors } from '../../../../styles/constants';

interface ProfileHeaderProps {
  isEditing: boolean;
  isPreviewMode: boolean;
  userName?: string;
  onEditClick: () => void;
}

export default function ProfileHeader({
  isEditing,
  isPreviewMode,
  userName = '김규빈',
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <>
      <div css={headerCss}>
        <p css={titleCss}>
          마이페이지 <span css={subTitleCss}>| Profile</span>
        </p>
      </div>
      <div css={sectionHeaderCss}>
        <p css={userNameCss}>{userName}</p>
        {!isEditing && (
          <div css={buttonWrapperCss}>
            <Button
              title={'수정하기'}
              variant="secondary"
              onClick={onEditClick}
            />
          </div>
        )}
        {isPreviewMode && (
          <div css={isPreviewModeIndicatorCss}>
            <img src="/icon/eye.svg" alt="눈" />
            <p css={isPreviewModeTextCss}>미리보기 화면입니다.</p>
          </div>
        )}
      </div>
    </>
  );
}

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
  margin-bottom: 5rem;
`;

const titleCss = css`
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const subTitleCss = css`
  font-weight: 400;
`;

const sectionHeaderCss = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const userNameCss = css`
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const buttonWrapperCss = css`
  width: 170px;
`;

const isPreviewModeIndicatorCss = css`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const isPreviewModeTextCss = css`
  color: ${colors.gdscRed};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;