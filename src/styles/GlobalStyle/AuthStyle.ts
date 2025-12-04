/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import type { Step } from '../../features/team-building/pages/SignUp/index';
import { colors } from '../../styles/constants/colors';

export const mainCss = (visible: boolean, step?: Step) => css`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  ${!step || step !== 2 ? 'align-items: center;' : ''}
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(25px);
  transition: all 0.5s ease;
  opacity: ${visible ? 1 : 0};
  ${step === 2 ? 'overflow-y: auto; scroll-behavior: smooth;' : ''}
`;

export const sectionCss = (visible: boolean, step: Step) => css`
  width: 420px;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
  padding: 36px 36px 44px;
  margin-top: ${step === 2 ? '280px' : '0px'};
  margin-bottom: ${step === 2 ? '100px' : '0px'};
  transform: ${visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  overflow: ${step === 2 ? 'hidden' : 'visible'};
  ${step === 1 && 'min-height: 330px;'}
  ${step === 2 && 'min-height: 740px;'}
  ${step === 3 && 'min-height: 500px;'}
`;

export const primaryBtn = ({ disabled }: { disabled: boolean }) => css`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: ${disabled ? colors.grayscale[300] : colors.primary[600]};
  color: ${disabled ? colors.grayscale[400] : colors.white};
  font-size: 16px;
  font-weight: 600;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  &:hover {
    background: ${disabled ? colors.grayscale[300] : colors.primary[700]};
  }
`;

export const secondaryBtn = css`
  width: 100%;
  height: 48px;
  font-size: 16px;
  border: 1px solid ${colors.primary[600]};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.primary[600]};
  font-weight: 600;
`;

export const choiceBtn = (active: boolean) => css`
  height: 60px;
  border-radius: 12px;
  border: 1.5px solid ${active ? colors.primary[600] : colors.grayscale[300]};
  background: ${active ? colors.primary[100] : colors.white};
  color: ${colors.black};
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  padding-left: 24px;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${colors.primary[600]};
    background: ${colors.primary[200]};
  }
`;

export const headerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1px;
  padding-top: 10px;
`;

export const titleCss = css`
  font-family:
    Pretendard,
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${colors.black};
  margin: 0;
`;

export const stepCss = css`
  font-size: 16px;
  color: ${colors.grayscale[600]};
  font-weight: 600;
`;

export const stepBoxCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const step1Box = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const step1Desc = css`
  font-size: 15px;
  font-weight: 400;
  color: ${colors.grayscale[600]};
  margin-bottom: 28px;
`;

export const step1BtnMargin = css`
  margin: 12px 0 32px 0;
`;

export const btnRowCss = css`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  & > button {
    flex: 1;
  }
`;

export const fieldCss = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
`;

export const labelCss = css`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.black};
`;

export const helperCss = css`
  font-size: 12px;
  color: ${colors.grayscale[600]};
`;

export const errorText = css`
  color: ${colors.point.red};
  font-size: 13px;
  margin: 2px 0 0 0;
`;

export const inputCss = (err: boolean) => css`
  height: 52px;
  border-radius: 12px;
  border: 1.5px solid ${err ? colors.point.red : colors.grayscale[300]};
  background: ${colors.white};
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.15s ease;
  &:focus {
    border-color: ${err ? colors.point.red : colors.primary[600]};
    box-shadow: 0 0 0 3px ${err ? 'rgba(234,67,53,0.1)' : 'rgba(66,133,244,0.15)'};
    outline: none;
  }
`;

export const selectCss = css`
  appearance: none;
  background: ${colors.white}
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' stroke='%239E9E9E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")
    no-repeat right 16px center;
  background-size: 18px;
  border: 1.5px solid ${colors.grayscale[300]};
  border-radius: 8px;
  padding: 10px 40px 10px 14px;
  font-size: 15px;
  color: ${colors.black};
  cursor: pointer;
  transition: border 0.2s ease;
  &:focus {
    border-color: ${colors.grayscale[500]};
    outline: none;
  }
  &:disabled {
    background-color: ${colors.grayscale[100]};
    color: ${colors.grayscale[400]};
    cursor: not-allowed;
  }
`;

export const disabledInputCss = css`
  background: ${colors.grayscale[100]};
  color: ${colors.grayscale[600]};
  cursor: not-allowed;
`;

export const radioGroupCss = css`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 6px;
`;

export const radioLabelCustom = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  span {
    font-size: 15px;
    font-weight: 600;
    color: ${colors.black};
    line-height: 20px;
    user-select: none;
  }
`;

export const radioInputHidden = css`
  position: relative;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px ${colors.grayscale[500]};
  background: none;
  margin: 0;
  cursor: pointer;
  transition: box-shadow 150ms cubic-bezier(0.95, 0.15, 0.5, 1.25);
  &:focus {
    outline: none;
  }
  &:checked {
    box-shadow: inset 0 0 0 6px ${colors.primary[600]};
  }
`;

export const checkLabelCustom = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 4px 0;
  cursor: pointer;
`;

export const checkInputHidden = css`
  display: none;
`;

export const checkCustom = (checked: boolean) => css`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: ${checked ? colors.primary[600] : colors.grayscale[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  &::after {
    content: '✓';
    font-size: 13px;
    color: ${colors.white};
    display: ${checked ? 'block' : 'none'};
  }
`;

export const scrollContainer = css`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding-right: 6px;
  margin-top: 8px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.grayscale[400]};
    border-radius: 3px;
  }
`;

export const gridCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const linkBtnCss = css`
  color: ${colors.black};
  font-weight: 600;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;

export const overlay = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  z-index: 50;
`;

export const modalBoxCss = css`
  background: ${colors.white};
  border-radius: 12px;
  padding: 24px 32px;
  width: 360px;
`;

export const confirmBoxCss = css`
  background: ${colors.white};
  border-radius: 12px;
  padding: 24px 32px;
  width: 360px;
  text-align: center;
`;

export const doneModalCss = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const doneBoxCss = css`
  background: ${colors.white};
  border-radius: 12px;
  width: 360px;
  padding: 28px 24px 32px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.25s ease;
  h2 {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 12px;
    padding-top: 10px;
  }
  p {
    font-size: 14px;
    color: ${colors.grayscale[700]};
    line-height: 1.6;
    margin-bottom: 24px;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const doneButtonCss = css`
  width: 100%;
  padding: 10px 0;
  background-color: ${colors.primary[600]};
  color: ${colors.white};
  font-size: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background-color: ${colors.primary[700]};
  }
`;

export const termsScrollCss = css`
  text-align: left;
  max-height: 360px;
  overflow-y: auto;
  margin-top: 20px;
  padding-right: 8px;
  font-size: 13px;
  color: ${colors.grayscale[700]};
  line-height: 1.6;
  white-space: pre-line;
  strong {
    font-weight: 700;
    color: ${colors.grayscale[900]};
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.grayscale[400]};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.grayscale[500]};
  }
`;

export const descCssStep2 = css`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.grayscale[600]};
  margin-bottom: 40px;
`;

export const descCssStep3 = css`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.grayscale[600]};
  margin-bottom: 36px;
`;

export const authStepSection = css`
  width: 420px;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
  padding: 36px 36px 48px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
`;

export const authStepTitle = css`
  font-size: 28px;
  font-weight: 600;
  color: ${colors.black};
  margin-bottom: 1px;
`;

export const authStepDesc = css`
  font-size: 15px;
  font-weight: 400;
  color: ${colors.grayscale[700]};
  margin-bottom: 28px;
`;

export const authStepButtonBox = css`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

export const authSubText = css`
  font-size: 12px;
  color: ${colors.grayscale[600]};
  margin-top: -8px;
  margin-bottom: 22px;
`;
