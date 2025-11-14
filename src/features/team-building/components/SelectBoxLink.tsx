import { useState } from 'react';

import {
  addButton,
  addButtonContainer,
  fieldContainer,
  fieldWrap,
  selectBoxContainer,
  wrap,
} from '../styles/selectBoxLink';
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
   * 초기 링크 목록
   */
  defaultValue?: Link[];
  /**
   * 최대 링크 개수
   */
  maxLinks?: number;
  /**
   * 선택 가능한 플랫폼 목록
   * @default ['GitHub', 'LinkedIn', 'Twitter', 'Website']
   */
  platforms?: string[];
}

export default function SelectBoxLink({
  onChange,
  defaultValue = [{ id: 0, platform: '', url: '' }],
  maxLinks = 10,
  platforms = ['GitHub', 'LinkedIn', 'Twitter', 'Website'],
}: SelectBoxLinkProps) {
  const [links, setLinks] = useState<Link[]>(defaultValue);

  const handleAddLink = () => {
    if (links.length >= maxLinks) return;

    const newLinks = [...links, { id: Date.now(), platform: '', url: '' }];
    setLinks(newLinks);
    onChange?.(newLinks);
  };

  const handleRemoveLink = (id: number) => {
    if (links.length <= 1) return;

    const newLinks = links.filter(link => link.id !== id);
    setLinks(newLinks);
    onChange?.(newLinks);
  };

  const handlePlatformChange = (id: number, platform: string) => {
    const newLinks = links.map(link => (link.id === id ? { ...link, platform: platform } : link));
    setLinks(newLinks);
    onChange?.(newLinks);
  };

  const handleUrlChange = (id: number, url: string) => {
    const newLinks = links.map(link => (link.id === id ? { ...link, url } : link));
    setLinks(newLinks);
    onChange?.(newLinks);
  };

  return (
    <div css={wrap}>
      {links.map(link => (
        <div key={link.id} css={fieldWrap}>
          <div css={selectBoxContainer}>
            <SelectBoxBasic
              options={platforms}
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
