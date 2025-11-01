import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const toggleContainerCss = css`
    width: 3rem; 
    height: 1.5rem; 
    padding: 0.125rem 1.625rem 0.125rem 0.125rem;
    border-radius: 2.4375rem; 
    background-color: ${colors.gray100};
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    display: flex;
    align-items: center;

    &.active {
        background-color: ${colors.gdscBlue};
        padding: 0.125rem 0.125rem 0.125rem 1.625rem;
    }
`;

export const toggleCircleCss = css`
    width: 1.25rem;
    height: 1.25rem; 
    border-radius: 0.625rem; 
    background-color: white;
    transition: all 0.3s ease;
    position: absolute;
    left: 0.125rem; 

    &.active {
        left: calc(100% - 1.375rem);
    }
`;