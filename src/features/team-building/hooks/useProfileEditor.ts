import { useEffect, useState } from 'react';

import { MyProfile, useUpdateMyProfile } from '@/lib/mypageProfile.api';

export interface Link {
  id: number;
  platform: string;
  url: string;
}

export const useProfileEditor = (profile?: MyProfile) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [bioMarkdown, setBioMarkdown] = useState('');
  const [savedTechStack, setSavedTechStack] = useState<string[]>([]);
  const [savedLinks, setSavedLinks] = useState<Link[]>([{ id: 0, platform: '', url: '' }]);

  const [tempMarkdown, setTempMarkdown] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [links, setLinks] = useState<Link[]>([{ id: 0, platform: '', url: '' }]);

  const { mutate: updateProfile } = useUpdateMyProfile();

  // 프로필 데이터가 로드되면 초기화
  useEffect(() => {
    if (profile) {
      const introduction = profile.introduction || '';
      const techStacks = profile.techStacks.map(ts => ts.techStackType);
      const userLinks: Link[] =
        profile.userLinks.length > 0
          ? profile.userLinks.map((ul, idx) => ({
              id: idx,
              platform: ul.linkType,
              url: ul.url,
            }))
          : [{ id: 0, platform: '', url: '' }];

      setBioMarkdown(introduction);
      setSavedTechStack(techStacks);
      setSavedLinks(userLinks);

      // 편집 중이 아닐 때만 temp 값도 동기화
      if (!isEditing) {
        setTempMarkdown(introduction);
        setSelectedTechStack(techStacks);
        setLinks(userLinks);
      }
    }
  }, [profile, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsPreviewMode(false);
    setTempMarkdown(bioMarkdown);
    setSelectedTechStack(savedTechStack);
    setLinks(savedLinks);
  };

  const handleSave = () => {
    // API 호출
    updateProfile(
      {
        techStacks: selectedTechStack.map(techStackType => ({ techStackType })),
        userLinks: links
          .filter(link => link.platform && link.url)
          .map(link => ({
            linkType: link.platform,
            url: link.url,
          })),
        introduction: tempMarkdown,
      },
      {
        onSuccess: () => {
          // 저장 성공 시 상태 업데이트
          setBioMarkdown(tempMarkdown);
          setSavedTechStack(selectedTechStack);
          setSavedLinks(links);

          setIsEditing(false);
          setIsPreviewMode(false);

          console.log('프로필 저장 성공:', {
            bio: tempMarkdown,
            techStack: selectedTechStack,
            links: links,
          });
        },
        onError: error => {
          console.error('프로필 저장 실패:', error);
          alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleCancel = () => {
    setTempMarkdown(bioMarkdown);
    setSelectedTechStack(savedTechStack);
    setLinks(savedLinks);

    setIsEditing(false);
    setIsPreviewMode(false);
  };

  const togglePreview = () => {
    setIsPreviewMode(prev => !prev);
  };

  return {
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
    handleCancel,
    togglePreview,
  };
};