'use client';

import { useState, useRef, useEffect } from 'react';
import {
    selectBoxWrapperCss,
    selectBoxHeaderCss,
    selectBoxPlaceholderCss,
    selectBoxSelectedCss,
    selectBoxArrowCss,
    selectBoxDropdownCss,
    selectBoxSearchCss,
    selectBoxListCss,
    selectBoxItemCss,
    checkIconCss,
} from '../styles/selectbox';
import Chip from './Chip';

interface SelectBoxProps {
    options: string[];
    placeholder?: string;
    multiple?: boolean;
    searchable?: boolean;
    onChange?: (selected: string[]) => void;
    className?: string;
}

export default function SelectBox({
    options,
    placeholder = '보유하고 있는 기술 스택을 선택해주세요.',
    multiple = true,
    searchable = true,
    onChange,
    className,
}: SelectBoxProps) {
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

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        let newSelected: string[];

        if (multiple) {
            if (selected.includes(option)) {
                newSelected = selected.filter((item) => item !== option);
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

    const handleRemove = (option: string) => {
        const newSelected = selected.filter((item) => item !== option);
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    const handleHeaderClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-chip-close]')) {
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div css={selectBoxWrapperCss} className={className} ref={wrapperRef}>
            <div
                css={selectBoxHeaderCss}
                className={isOpen ? 'open' : ''}
                onClick={handleHeaderClick}
            >
                {selected.length === 0 ? (
                    <span css={selectBoxPlaceholderCss}>{placeholder}</span>
                ) : (
                    <div css={selectBoxSelectedCss}>
                        {selected.map((item) => (
                            <Chip
                                key={item}
                                onClose={() => handleRemove(item)}
                            >
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
                            placeholder="기술 스택을 검색해주세요."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    <ul css={selectBoxListCss}>
                        {filteredOptions.map((option) => (
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