import { useEffect, useState } from 'react';

import {
  addButton,
  addButtonContainer,
  fieldContainer,
  fieldWrap,
  selectBoxContainer,
  wrap,
} from '../styles/selectBoxLink';
import { UserLinkOption } from '@/lib/mypageProfile.api';
import Field from './Field';
import SelectBoxBasic from './SelectBoxBasic';

interface Link {
  id: number;
  platform: string;
  url: string;
}

interface SelectBoxLinkProps {
  /**
   * 링크 변경 시 호출되는 콜백
   */
  onChange?: (links: Link[]) => void;
  /**
   * 현재 링크 목록 (controlled component)
   */
  value?: Link[];
  /**
   * 초기 링크 목록 (uncontrolled component)
   */
  defaultValue?: Link[];
  /**
   * 최대 링크 개수
   */
  maxLinks?: number;
  /**
   * 선택 가능한 플랫폼 목록 (API에서 받은 옵션)
   */
  options?: UserLinkOption[];
}

export default function SelectBoxLink({
  onChange,
  value,
  defaultValue = [{ id: 0, platform: '', url: '' }],
  maxLinks = 10,
  options = [],
}: SelectBoxLinkProps) {
  // Controlled vs Uncontrolled
  const isControlled = value !== undefined;
  const [internalLinks, setInternalLinks] = useState<Link[]>(defaultValue);

  // Controlled 모드일 때 외부 value 사용
  const links = isControlled ? value : internalLinks;

  // 플랫폼 옵션을 SelectBoxBasic에 맞게 변환 (type 값만 추출)
  const platformOptions = options.length > 0 
    ? options.map(opt => opt.type)
    : ['GitHub', 'LinkedIn', 'Twitter', 'Website']; // fallback

  // value prop이 변경되면 내부 상태 업데이트 (초기화 시)
  useEffect(() => {
    if (!isControlled && value) {
      setInternalLinks(value);
    }
  }, [value, isControlled]);

  const updateLinks = (newLinks: Link[]) => {
    if (!isControlled) {
      setInternalLinks(newLinks);
    }
    onChange?.(newLinks);
  };

  const handleAddLink = () => {
    if (links.length >= maxLinks) return;

    const newLinks = [...links, { id: Date.now(), platform: '', url: '' }];
    updateLinks(newLinks);
  };

  const handleRemoveLink = (id: number) => {
    if (links.length <= 1) return;

    const newLinks = links.filter(link => link.id !== id);
    updateLinks(newLinks);
  };

  const handlePlatformChange = (id: number, platform: string) => {
    const newLinks = links.map(link => (link.id === id ? { ...link, platform } : link));
    updateLinks(newLinks);
  };

  const handleUrlChange = (id: number, url: string) => {
    const newLinks = links.map(link => (link.id === id ? { ...link, url } : link));
    updateLinks(newLinks);
  };

  return (
    <div css={wrap}>
      {links.map(link => (
        <div key={link.id} css={fieldWrap}>
          <div css={selectBoxContainer}>
            <SelectBoxBasic
              options={platformOptions}
              placeholder="플랫폼 선택"
              value={link.platform ? [link.platform] : []}
              onChange={selected => handlePlatformChange(link.id, selected[0] || '')}
            />
          </div>
          <div css={fieldContainer}>
            <Field
              placeholder="링크 URL을 입력하세요"
              value={link.url}
              onChange={e => handleUrlChange(link.id, e.target.value)}
            />
          </div>
          {links.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveLink(link.id)}
              aria-label="링크 삭제"
              css={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#979CA5',
                fontSize: '20px',
                '&:hover': {
                  color: '#ff4444',
                },
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {links.length < maxLinks && (
        <div css={addButtonContainer}>
          <button type="button" css={addButton} onClick={handleAddLink} aria-label="링크 추가">
            +
          </button>
        </div>
      )}
    </div>
  );
}