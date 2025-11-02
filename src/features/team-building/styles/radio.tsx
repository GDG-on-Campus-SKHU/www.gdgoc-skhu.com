import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const radioWrapperCss = css`
    display: inline-flex;
    align-items: center;
    gap: 0.7rem; 
    cursor: pointer;
    
    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export const radioButtonCss = css`
    width: 1.25rem;
    height: 1.25rem; 
    border-radius: 50%;
    border: 0.125rem solid #000;
    background-color: white;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    &.checked {
        background-color: ${colors.gdscBlue};
        border-color: ${colors.gdscBlue};

        &::after {
            content: '';
            width: 0.625rem; 
            height: 0.625rem;
            border-radius: 50%;
            background-color: white;
        }
    }

    &.disabled {
        background-color: #b0b0b0;
        border-color: #b0b0b0;

        &::after {
            background-color: white;
        }
    }
`;

export const radioLabelCss = css`
    font-size: 1rem; /* 16px */
    font-weight: 400;
    color: #000;
    user-select: none;

    &.disabled {
        color: #b0b0b0;
    }
`;