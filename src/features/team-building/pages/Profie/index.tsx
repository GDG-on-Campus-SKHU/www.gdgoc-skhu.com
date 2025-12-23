import Link from 'next/link';
import { useMyProfile, useUserProfile } from '@/lib/mypageProfile.api';
import { css } from '@emotion/react';

import { colors, layoutCss } from '../../../../styles/constants';
import ProfileBio from '../../components/Profile/ProfileBio';
import ProfileEditButtons from '../../components/Profile/ProfileEditButtons';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileList from '../../components/Profile/ProfileList';
import { useProfileEditor } from '../../hooks/useProfileEditor';

type ProfileMode = 'me' | 'other';

type ProfilePageProps = { mode?: 'me'; userId?: never } | { mode: 'other'; userId: number };

export default function ProfilePage(props: ProfilePageProps) {
  const mode: ProfileMode = props.mode ?? 'me';
  const isOtherUser = mode === 'other';

  const myQuery = useMyProfile({ enabled: !isOtherUser });
  const otherQuery = useUserProfile(props.mode === 'other' ? props.userId : undefined, {
    enabled: isOtherUser,
  });

  const profile = isOtherUser ? otherQuery.data : myQuery.data;
  const isLoading = isOtherUser ? otherQuery.isLoading : myQuery.isLoading;
  const error = isOtherUser ? otherQuery.error : myQuery.error;

  const editor = useProfileEditor(profile);
  const isEditing = isOtherUser ? false : editor.isEditing;
  const isPreviewMode = isOtherUser ? false : editor.isPreviewMode;

  const {
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
  } = editor;

  if (isLoading) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={loadingCss}>프로필을 불러오는 중...</div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={errorCss}>{error ? '오류가 발생했습니다.' : '정보가 없습니다.'}</div>
        </div>
      </main>
    );
  }

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {isOtherUser && <div css={emptyCss}></div>}

        <div>
          <ProfileHeader
            isEditing={isEditing}
            isPreviewMode={isPreviewMode}
            userName={profile.name}
            onEditClick={handleEditClick}
            hideMyPageTitle={isOtherUser}
            hideEditButton={isOtherUser}
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
            isPreviewMode={isPreviewMode}
            bioMarkdown={bioMarkdown}
            tempMarkdown={tempMarkdown}
            setTempMarkdown={setTempMarkdown}
          />
        </div>

        {!isOtherUser && (
          <>
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
          </>
        )}

        {isOtherUser && <div css={emptyCss}></div>}
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

const emptyCss = css`
  display: flex;
  margin-top: 60px;
`;
