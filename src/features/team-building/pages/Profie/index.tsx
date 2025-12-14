import Link from 'next/link';
import { useMyProfile } from '@/lib/mypageProfile.api';
import { css } from '@emotion/react';

import { colors, layoutCss } from '../../../../styles/constants';
import ProfileBio from '../../components/Profile/ProfileBio';
import ProfileEditButtons from '../../components/Profile/ProfileEditButtons';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileList from '../../components/Profile/ProfileList';
import { useProfileEditor } from '../../hooks/useProfileEditor';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useMyProfile();

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
  } = useProfileEditor(profile);

  // 로딩 상태
  if (isLoading) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={loadingCss}>프로필을 불러오는 중...</div>
        </div>
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={errorCss}>프로필을 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </main>
    );
  }

  // 데이터 없음
  if (!profile) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={errorCss}>프로필 정보가 없습니다.</div>
        </div>
      </main>
    );
  }

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div>
          <ProfileHeader
            isEditing={isEditing}
            isPreviewMode={isPreviewMode}
            userName={profile.name}
            onEditClick={handleEditClick}
          />

          <ProfileList
            isEditing={isEditing}
            isPreviewMode={isPreviewMode}
            profile={profile}
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

const loadingCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`;

const errorCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #e53e3e;
`;
