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
  options: string[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  onChange?: (selected: string[]) => void;
  className?: string;
}

export default function SelectBoxBasic({
  options,
  placeholder = options[0],
  multiple = false,
  searchable = false,
  onChange,
  className,
}: SelectBoxBasicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
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
    }

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const getDisplayText = () => {
    if (selected.length === 0) return null;
    if (selected.length === 1) return selected[0];
    return `${selected[0]} 외 ${selected.length - 1}개`;
  };

  return (
    <div css={selectBoxWrapperCss} className={className} ref={wrapperRef}>
      <div
        css={selectBoxHeaderCss}
        className={isOpen ? 'open' : ''}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span css={selectBoxPlaceholderCss}>{placeholder}</span>
        ) : (
          <span css={selectBoxSelectedTextCss}>{getDisplayText()}</span>
        )}
        <svg
          css={selectBoxArrowCss}
          className={isOpen ? 'open' : ''}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && (
        <div css={selectBoxDropdownCss}>
          {searchable && (
            <input
              css={selectBoxSearchCss}
              type="text"
              placeholder="검색해주세요."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          )}
          <ul css={selectBoxListCss}>
            {filteredOptions.map(option => (
              <li
                key={option}
                css={selectBoxItemCss}
                className={selected.includes(option) ? 'selected' : ''}
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>
                {selected.includes(option) && (
                  <svg
                    css={checkIconCss}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
