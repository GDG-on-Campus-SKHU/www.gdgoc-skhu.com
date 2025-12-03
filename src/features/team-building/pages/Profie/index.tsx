import Link from 'next/link';
import { css } from '@emotion/react';

import { colors, layoutCss } from '../../../../styles/constants';
import ProfileBio from '../../components/Profile/ProfileBio';
import ProfileEditButtons from '../../components/Profile/ProfileEditButtons';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileList from '../../components/Profile/ProfileList';
import { useProfileEditor } from '../../hooks/useProfileEditor';

export default function ProfilePage() {
  const {
    isEditing,
    isPreviewMode,
    bioMarkdown,
    tempMarkdown,
    selectedTechStack,
    links,
    savedTechStack,
    savedLinks,
    setTempMarkdown,
    setSelectedTechStack,
    setLinks,
    handleEditClick,
    handleSave,
    togglePreview,
  } = useProfileEditor('');

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div>
          <ProfileHeader
            isEditing={isEditing}
            isPreviewMode={isPreviewMode}
            onEditClick={handleEditClick}
          />

          <ProfileList
            isEditing={isEditing}
            isPreviewMode={isPreviewMode}
            selectedTechStack={isEditing ? selectedTechStack : savedTechStack}
            links={isEditing ? links : savedLinks}
            onTechStackChange={setSelectedTechStack}
            onLinksChange={setLinks}
          />

          <ProfileBio
            isEditing={isEditing}
            bioMarkdown={isEditing ? tempMarkdown : bioMarkdown}
            tempMarkdown={tempMarkdown}
            setTempMarkdown={setTempMarkdown}
          />
        </div>

        {!isEditing ? (
          <Link href={'/mypage/secession'}>
            <button css={secessionCss}>탈퇴하기</button>
          </Link>
        ) : (
          <ProfileEditButtons
            isPreviewMode={isPreviewMode}
            onPreview={togglePreview}
            onBackToEdit={togglePreview}
            onSave={handleSave}
          />
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
  background-color: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding-top: 4rem;
`;

const innerCss = css`
  ${layoutCss}
`;

const secessionCss = css`
  margin-top: 9rem;
  margin-bottom: 4rem;
  font-size: 20px;
  font-style: normal;
  color: ${colors.grayscale[500]};
  font-weight: 500;
  line-height: 160%;
  display: block;
  width: 100%;
  text-align: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
