'use client';

import { useState } from 'react';
import { radioWrapperCss, radioButtonCss, radioLabelCss } from '../styles/radio';

interface RadioButtonProps {
    label?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
}

export default function RadioButton({ 
    label = 'Radio button',
    defaultChecked = true,
    disabled = true,
    onChange,
    className
}: RadioButtonProps) {
    const [checked, setChecked] = useState(defaultChecked);

    const handleClick = () => {
        if (disabled) return;
        setChecked(!checked);
        onChange?.(!checked);
    };

    return (
        <label 
            css={radioWrapperCss}
            className={`${disabled ? 'disabled' : ''} ${className || ''}`}
            onClick={handleClick}
        >
            <div 
                css={radioButtonCss}
                className={`${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
                role="radio"
                aria-checked={checked}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
            />
            <span 
                css={radioLabelCss}
                className={disabled ? 'disabled' : ''}
            >
                {label}
            </span>
        </label>
    );
}