import { useEffect, useId, useRef, useState } from 'react';

import {
  checkIconCss,
  selectBoxArrowCss,
  selectBoxDropdownCss,
  selectBoxHeaderCss,
  selectBoxItemCss,
  selectBoxListCss,
  selectBoxPlaceholderCss,
  selectBoxSearchCss,
  selectBoxSelectedCss,
  selectBoxWrapperCss,
} from '../styles/selectbox';
import Chip from './Chip';

interface SelectBoxProps {
  /**
   * 선택 가능한 옵션 목록
   */
  options: string[];
  /**
   * placeholder 텍스트
   * @default '보유하고 있는 기술 스택을 선택해주세요.'
   */
  placeholder?: string;
  /**
   * 다중 선택 가능 여부
   * @default true
   */
  multiple?: boolean;
  /**
   * 검색 기능 활성화 여부
   * @default true
   */
  searchable?: boolean;
  /**
   * 선택 값 변경 시 호출되는 콜백
   */
  onChange?: (selected: string[]) => void;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 초기 선택 값
   */
  defaultValue?: string[];
  /**
   * 제어 컴포넌트로 사용 시 선택 값
   */
  value?: string[];
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
}

export default function SelectBox({
  options,
  placeholder = '보유하고 있는 기술 스택을 선택해주세요.',
  multiple = true,
  searchable = true,
  onChange,
  className,
  defaultValue = [],
  value,
  disabled = false,
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultValue);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const isControlled = value !== undefined;
  const selected = isControlled ? value : internalSelected;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    if (disabled) return;

    let newSelected: string[];

    if (multiple) {
      if (selected.includes(option)) {
        newSelected = selected.filter(item => item !== option);
      } else {
        newSelected = [...selected, option];
      }
    } else {
      newSelected = [option];
      setIsOpen(false);
      setSearchTerm('');
    }

    if (!isControlled) {
      setInternalSelected(newSelected);
    }
    onChange?.(newSelected);
  };

  const handleRemove = (option: string) => {
    if (disabled) return;

    const newSelected = selected.filter(item => item !== option);

    if (!isControlled) {
      setInternalSelected(newSelected);
    }
    onChange?.(newSelected);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (disabled) return;

    if ((e.target as HTMLElement).closest('[data-chip-close]')) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div
      css={selectBoxWrapperCss}
      className={`${disabled ? 'disabled' : ''} ${className || ''}`}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <div
        css={selectBoxHeaderCss}
        className={`${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleHeaderClick}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        aria-controls={listboxId}
        tabIndex={disabled ? -1 : 0}
      >
        {selected.length === 0 ? (
          <span css={selectBoxPlaceholderCss}>{placeholder}</span>
        ) : (
          <div css={selectBoxSelectedCss}>
            {selected.map(item => (
              <Chip key={item} onClose={() => handleRemove(item)} disabled={disabled}>
                {item}
              </Chip>
            ))}
          </div>
        )}
        <svg
          css={selectBoxArrowCss}
          className={isOpen ? 'open' : ''}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div css={selectBoxDropdownCss} role="listbox" id={listboxId}>
          {searchable && (
            <input
              css={selectBoxSearchCss}
              type="text"
              placeholder="기술 스택을 검색해주세요."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
              aria-label="옵션 검색"
            />
          )}
          <ul css={selectBoxListCss}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option}
                  css={selectBoxItemCss}
                  className={selected.includes(option) ? 'selected' : ''}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selected.includes(option)}
                >
                  <span>{option}</span>
                  {selected.includes(option) && (
                    <svg
                      css={checkIconCss}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li css={selectBoxItemCss} style={{ cursor: 'default', opacity: 0.5 }}>
                검색 결과가 없습니다.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
