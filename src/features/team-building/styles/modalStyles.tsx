import { css, keyframes } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';
import { typography } from '../../../styles/constants/text';
import { ModalType } from '../components/Modal.types';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
`;

export const overlayCss = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.25s ease forwards;
`;

export const closingOverlayCss = css`
  animation: ${fadeOut} 0.25s ease forwards;
`;

export const boxCss = (type?: ModalType) => css`
  background: ${colors.white};
  border-radius: 12px;
  width: ${type === 'scroll' || type === 'terms' ? '460px' : '380px'};
  max-height: 80vh;
  padding: 36px 28px 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  animation: ${scaleIn} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const closingBoxCss = css`
  animation: ${scaleOut} 0.25s ease forwards;
`;

export const titleCss = css`
  font-size: 24px;
  font-weight: 700;
  line-height: 150%;
  color: ${colors.grayscale[1000]};
  margin-bottom: 20px;
`;

export const messageCss = css`
  ${typography.b4};
  color: ${colors.grayscale[600]};
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-line;
`;

export const subTextCss = css`
  ${typography.b4};
  color: ${colors.grayscale[600]};
  margin-bottom: 26px;
`;

export const buttonCss = css`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  background-color: ${colors.primary[600]};
  color: ${colors.grayscale[100]};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${colors.primary[700]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const buttonRowCss = css`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 10px;
`;

export const buttonSecondaryCss = css`
  width: 100%;
  height: 46px;
  border: 1px solid ${colors.grayscale[300]};
  border-radius: 8px;
  background-color: ${colors.white};
  color: ${colors.grayscale[700]};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${colors.primary[100]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const scrollBoxCss = css`
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  text-align: left;
  ${typography.b4};
  color: ${colors.grayscale[700]};
  line-height: 1.6;
  white-space: pre-line;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.grayscale[300]};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.grayscale[400]};
  }
`;
