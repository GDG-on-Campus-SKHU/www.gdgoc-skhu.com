import { useRef, useState } from 'react';
import Image from 'next/image';
import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';
import search from '../assets/search.svg';

type FieldOfSearchProps = {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  completed?: boolean;
  defaultCompleted?: boolean;
  className?: string;
};

export default function FieldOfSearch({
  placeholder = '검색어를 입력해주세요.',
  value,
  defaultValue,
  onChange,
  onSearch,
  disabled = false,
  completed,
  defaultCompleted = false,
  className,
}: FieldOfSearchProps) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const [internalCompleted, setInternalCompleted] = useState(defaultCompleted);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : innerValue;
  const isCompleted = completed ?? internalCompleted;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInnerValue(next);
    setInternalCompleted(false);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = currentValue.trim();
      if (!trimmed) return;

      onSearch?.(trimmed);
      setInternalCompleted(true); // 완료 상태
      inputRef.current?.blur(); // 파란 테두리 제거
    }
  };

  const handleWrapperClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  return (
    <div css={wrapperCss(isCompleted, disabled)} className={className} onClick={handleWrapperClick}>
      <span css={iconCss} aria-hidden>
        <Image src={search} alt="돋보기" />
      </span>
      <input
        ref={inputRef}
        css={inputCss}
        type="search"
        disabled={disabled}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

const wrapperCss = (completed: boolean, disabled: boolean) => css`
  width: 100%;
  height: 50px;
  padding: 0 14px;

  display: flex;
  align-items: center;
  gap: 15px;

  border-radius: 8px;
  border: 1px ${colors.grayscale[400]} solid;
  background: ${colors.white};

  cursor: ${disabled ? 'not-allowed' : 'text'};
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.grayscale[100]};
  }

  &:focus-within {
    border-color: ${colors.primary[600]};
    background: ${colors.white};
  }
`;

const iconCss = css`
  font-size: 16px;
`;

const inputCss = css`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;

  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  color: ${colors.grayscale[1000]};

  &::placeholder {
    color: ${colors.grayscale[500]};
  }

  // 브라우저 기본 X 버튼 제거
  &::-webkit-search-cancel-button {
    display: none;
  }
`;
