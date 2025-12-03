import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import { Link } from '../../hooks/useProfileEditor';
import { TECH_STACK_OPTIONS } from '../../types/profile';
import SelectBox from '../SelectBox';
import SelectBoxLink from '../SelectBoxLink';
import Tag from './Tag';

const BASE_PROFILE_ITEMS = [
  { label: '학교', value: '성공회대학교' },
  { label: '역할', value: '25-26 Member' },
  { label: '파트', value: 'Design' },
];

interface ProfileListProps {
  isEditing: boolean;
  isPreviewMode: boolean;
  selectedTechStack: string[];
  links: Link[];
  onTechStackChange: (techStack: string[]) => void;
  onLinksChange: (links: Link[]) => void;
}

export default function ProfileList({
  isEditing,
  isPreviewMode,
  selectedTechStack,
  links,
  onTechStackChange,
  onLinksChange,
}: ProfileListProps) {
  // 편집 필드를 보여줄 조건: 편집 중이면서 미리보기 모드가 아닐 때
  const showEditFields = isEditing && !isPreviewMode;

  // 프리뷰를 보여줄 조건: 편집 중이 아니거나, 편집 중이면서 미리보기 모드일 때
  const showPreview = !isEditing || (isEditing && isPreviewMode);

  const hasValidLinks = links.some(link => link.platform && link.url);
  const hasTechStack = selectedTechStack.length > 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/icon/link.svg';
  };

  const renderBaseProfileItem = (item: (typeof BASE_PROFILE_ITEMS)[0]) => (
    <li key={item.label} css={profileItemCss}>
      <p css={labelCss}>{item.label}</p>
      {item.label === '역할' ? (
        <div css={roleContainerCss}>
          <Tag label={item.value} />
          <Tag label={item.value} disabled />
        </div>
      ) : (
        <p css={valueCss}>{item.value}</p>
      )}
    </li>
  );

  const renderTechStackContent = () => {
    if (showEditFields) {
      return (
        <div css={componentWrapperCss}>
          <SelectBox
            options={TECH_STACK_OPTIONS}
            value={selectedTechStack}
            onChange={onTechStackChange}
          />
        </div>
      );
    }

    if (showPreview && hasTechStack) {
      return (
        <div css={techStackPreviewCss}>
          {selectedTechStack.map(tech => (
            <div key={tech} css={techIconWrapperCss}>
              <div css={techIconCss}>
                <img src={`/icon/${tech}.svg`} alt={tech} />
              </div>
              <div css={tooltipCss}>{tech}</div>
            </div>
          ))}
        </div>
      );
    }

    return <p css={placeholderValueCss}>아직 추가된 기술 스택이 없어요.</p>;
  };

  const renderLinksContent = () => {
    if (showEditFields) {
      return (
        <div css={componentWrapperCss}>
          <SelectBoxLink value={links} onChange={onLinksChange} />
        </div>
      );
    }

    if (showPreview && hasValidLinks) {
      return (
        <div css={linksPreviewCss}>
          {links
            .filter(link => link.platform && link.url)
            .map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                css={linkIconCss}
                title={link.platform}
              >
                <img
                  src={`/icon/${link.platform}.svg`}
                  alt={link.platform}
                  onError={handleImageError}
                />
              </a>
            ))}
        </div>
      );
    }

    return <p css={placeholderValueCss}>아직 추가된 링크가 없어요.</p>;
  };

  return (
    <ul css={profileListCss}>
      {BASE_PROFILE_ITEMS.map(renderBaseProfileItem)}

      {/* 기술스택 */}
      <li
        css={[profileItemCss, (showEditFields || (showPreview && hasTechStack)) && editingItemCss]}
      >
        <p css={labelCss}>기술스택</p>
        {renderTechStackContent()}
      </li>

      {/* 링크 */}
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

const techIconWrapperCss = css`
  position: relative;
  display: inline-block;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
  }
`;

const techStackPreviewCss = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

const techIconCss = css`
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

const linksPreviewCss = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

const linkIconCss = css`
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
`;
