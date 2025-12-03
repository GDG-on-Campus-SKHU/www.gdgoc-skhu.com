import { useEffect, useRef, useState } from 'react';

import {
  checkIconCss,
  selectBoxArrowCss,
  selectBoxDropdownCss,
  selectBoxHeaderCss,
  selectBoxItemCss,
  selectBoxListCss,
  selectBoxPlaceholderCss,
  selectBoxSearchCss,
  selectBoxSelectedTextCss,
  selectBoxWrapperCss,
} from '../styles/selectbox';

interface SelectBoxBasicProps {
  /**
   * 선택 가능한 옵션 목록
   */
  options: string[];
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
  /**
   * 다중 선택 가능 여부
   * @default false
   */
  multiple?: boolean;
  /**
   * 검색 기능 활성화 여부
   * @default false
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

export default function SelectBoxBasic({
  options,
  placeholder,
  multiple = false,
  searchable = false,
  onChange,
  className,
  defaultValue = [],
  value,
  disabled = false,
}: SelectBoxBasicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultValue);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const getDisplayText = () => {
    if (selected.length === 0) return null;
    if (selected.length === 1) return selected[0];
    return `${selected[0]} 외 ${selected.length - 1}개`;
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
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="selectbox-listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {selected.length === 0 ? (
          <span css={selectBoxPlaceholderCss}>{placeholder || options[0]}</span>
        ) : (
          <span css={selectBoxSelectedTextCss}>{getDisplayText()}</span>
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
        <div css={selectBoxDropdownCss} role="listbox" id="selectbox-listbox">
          {searchable && (
            <input
              css={selectBoxSearchCss}
              type="text"
              placeholder="검색해주세요."
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
