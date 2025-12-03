import { useState } from 'react';

export interface Link {
  id: number;
  platform: string;
  url: string;
}

export const useProfileEditor = (initialMarkdown: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [bioMarkdown, setBioMarkdown] = useState(initialMarkdown);
  const [savedTechStack, setSavedTechStack] = useState<string[]>([]);
  const [savedLinks, setSavedLinks] = useState<Link[]>([{ id: 0, platform: '', url: '' }]);

  const [tempMarkdown, setTempMarkdown] = useState(bioMarkdown);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>(savedTechStack);
  const [links, setLinks] = useState<Link[]>(savedLinks);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsPreviewMode(false);
    setTempMarkdown(bioMarkdown);
    setSelectedTechStack(savedTechStack);
    setLinks(savedLinks);
  };

  const handleSave = () => {
    setBioMarkdown(tempMarkdown);
    setSavedTechStack(selectedTechStack);
    setSavedLinks(links);

    setIsEditing(false);
    setIsPreviewMode(false);

    console.log('저장된 데이터:', {
      bio: tempMarkdown,
      techStack: selectedTechStack,
      links: links,
    });
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
