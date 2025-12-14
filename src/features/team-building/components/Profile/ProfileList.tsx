import { css } from '@emotion/react';
import { useState } from 'react';

import { colors } from '../../../../styles/constants';
import { MyProfile, useTechStackOptions, useUserLinkOptions } from '@/lib/mypageProfile.api';
import { Link } from '../../hooks/useProfileEditor';
import SelectBox from '../SelectBox';
import SelectBoxLink from '../SelectBoxLink_han';
import Tag from './Tag';

interface ProfileListProps {
  isEditing: boolean;
  isPreviewMode: boolean;
  profile: MyProfile;
  selectedTechStack: string[];
  links: Link[];
  onTechStackChange: (techStack: string[]) => void;
  onLinksChange: (links: Link[]) => void;
}

export default function ProfileList({
  isEditing,
  isPreviewMode,
  profile,
  selectedTechStack,
  links,
  onTechStackChange,
  onLinksChange,
}: ProfileListProps) {
  // 옵션 데이터 조회
  const { data: techStackOptions = [] } = useTechStackOptions();
  const { data: userLinkOptions = [] } = useUserLinkOptions();

  const showEditFields = isEditing && !isPreviewMode;
  const showPreview = !isEditing || (isEditing && isPreviewMode);

  const validLinks = links.filter(link => link.platform && link.url);
  const hasValidLinks = validLinks.length > 0;
  const hasTechStack = selectedTechStack.length > 0;

  // 메인 기수 찾기
  const mainGeneration = profile.generations.find(gen => gen.isMain);
  const generationLabel = mainGeneration
    ? `${mainGeneration.generation} ${mainGeneration.position}`
    : '정보 없음';

  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (linkId: number) => {
    setFailedImages(prev => new Set(prev).add(linkId));
  };

  const baseProfileItems = [
    { label: '학교', value: profile.school, isRole: false },
    { label: '역할', value: generationLabel, isRole: true },
    { label: '파트', value: profile.part, isRole: false },
  ] as const;

  const renderBaseProfileItem = (item: (typeof baseProfileItems)[number]) => (
    <li key={item.label} css={profileItemCss}>
      <p css={labelCss}>{item.label}</p>
      {item.isRole ? (
        <div css={roleContainerCss}>
          {profile.generations.map(gen => (
            <Tag key={gen.id} label={`${gen.generation} ${gen.position}`} disabled={!gen.isMain} />
          ))}
        </div>
      ) : (
        <p css={valueCss}>{item.value}</p>
      )}
    </li>
  );

  const renderTechStackContent = () => {
    if (showEditFields) {
      // 옵션을 SelectBox 형식에 맞게 변환
      const techStackSelectOptions = techStackOptions.map(opt => opt.code);

      return (
        <div css={componentWrapperCss}>
          <SelectBox
            options={techStackSelectOptions}
            value={selectedTechStack}
            onChange={onTechStackChange}
          />
        </div>
      );
    }

    if (showPreview && hasTechStack) {
      return (
        <div css={previewContainerCss}>
          {selectedTechStack.map(techCode => {
            const techOption = techStackOptions.find(opt => opt.code === techCode);
            return (
              <div key={techCode} css={iconWrapperCss}>
                <div css={iconCss}>
                  <img
                    src={techOption?.iconUrl || `/icon/${techCode}.svg`}
                    alt={techOption?.displayName || techCode}
                  />
                </div>
                <div css={tooltipCss}>{techOption?.displayName || techCode}</div>
              </div>
            );
          })}
        </div>
      );
    }

    return <p css={placeholderValueCss}>아직 추가된 기술 스택이 없어요.</p>;
  };

  const renderLinksContent = () => {
    if (showEditFields) {
      return (
        <div css={componentWrapperCss}>
          <SelectBoxLink value={links} onChange={onLinksChange} options={userLinkOptions} />
        </div>
      );
    }

    if (showPreview && hasValidLinks) {
      return (
        <div css={previewContainerCss}>
          {validLinks.map(link => {
            const linkOption = userLinkOptions.find(opt => opt.type === link.platform);
            const hasImageError = failedImages.has(link.id);
            
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                css={hasImageError ? linkIconWithBorderCss : linkIconSimpleCss}
                title={linkOption?.name || link.platform}
              >
                <img
                  src={hasImageError ? '/icon/link.svg' : (linkOption?.iconUrl || `/icon/${link.platform}.svg`)}
                  alt={linkOption?.name || link.platform}
                  onError={() => handleImageError(link.id)}
                />
              </a>
            );
          })}
        </div>
      );
    }

    return <p css={placeholderValueCss}>아직 추가된 링크가 없어요.</p>;
  };

  return (
    <ul css={profileListCss}>
      {baseProfileItems.map(renderBaseProfileItem)}

      <li
        css={[profileItemCss, (showEditFields || (showPreview && hasTechStack)) && editingItemCss]}
      >
        <p css={labelCss}>기술스택</p>
        {renderTechStackContent()}
      </li>

      <li
        css={[profileItemCss, (showEditFields || (showPreview && hasValidLinks)) && editingItemCss]}
      >
        <p css={labelCss}>링크</p>
        {renderLinksContent()}
      </li>
    </ul>
  );
}

const profileListCss = css`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3.5rem;
`;

const profileItemCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const labelCss = css`
  min-width: 150px;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
`;

const valueCss = css`
  font-size: 24px;
  font-weight: 400;
`;

const placeholderValueCss = css`
  ${valueCss};
  font-size: 20px;
  color: ${colors.grayscale[600]};
  flex: 1;
  text-align: left;
`;

const roleContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const editingItemCss = css`
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

const componentWrapperCss = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const iconWrapperCss = css`
  position: relative;
  display: inline-block;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
  }
`;

const previewContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

const iconCss = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const tooltipCss = css`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: ${colors.grayscale[700]};
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-4px) rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: ${colors.grayscale[700]};
    border-radius: 0 0 2px 0;
  }
`;

const linkIconSimpleCss = css`
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const linkIconWithBorderCss = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  background-color: white;
  padding: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    border-color: ${colors.grayscale[600]};
  }
`;
