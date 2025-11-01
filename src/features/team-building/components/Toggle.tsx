'use client';

import { useState } from 'react';
import { toggleContainerCss, toggleCircleCss } from '../styles/toggle';

interface ToggleProps {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Toggle({ 
    defaultChecked = false,
    checked: controlledChecked,
    onChange,
    disabled = false
}: ToggleProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleToggle = () => {
        if (disabled) return;
        
        const newValue = !isChecked;
        
        if (!isControlled) {
            setInternalChecked(newValue);
        }
        
        onChange?.(newValue);
    };

    return (
        <div 
            css={toggleContainerCss}
            className={isChecked ? 'active' : ''}
            onClick={handleToggle}
            role="switch"
            aria-checked={isChecked}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle();
                }
            }}
        >
            <div 
                css={toggleCircleCss}
                className={isChecked ? 'active' : ''}
            />
        </div>
    );
}