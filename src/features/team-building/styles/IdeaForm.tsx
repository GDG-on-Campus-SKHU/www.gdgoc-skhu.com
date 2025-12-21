import styled, { css } from 'styled-components';

import { colors } from '../../../styles/constants';

export const PageContainer = styled.div<{ $isModalOpen?: boolean }>`
  width: 100%;
  min-height: 100vh;
  background: ${({ $isModalOpen }) => ($isModalOpen ? '#f3f4f6' : '#ffffff')};
  display: flex;
  justify-content: center;
  padding: 40px 0 120px;
  position: relative;

  /* 모달이 열렸을 때 배경 blur 처리 */
  ${({ $isModalOpen }) =>
    $isModalOpen &&
    `
    &::before {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      z-index: 9998;
      color: #626673;
      content: '';
    }
  `}
`;

export const FormContainer = styled.div`
  width: min(1080px, 100%);
  display: flex;
  flex-direction: column;
  gap: 40px;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px 0 20px;
  border-bottom: 0;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

export const AutoSaveStatus = styled.span.attrs({
  role: 'status',
  'aria-live': 'polite',
})<{ $saving: boolean }>`
  color: var(--grayscale-1000, #040405);
  text-align: right;

  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  padding-bottom: 10px;
  line-height: 160%; /* 32px */
`;

export const FieldHint = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const FieldCounter = styled.span<{
  $isOver?: boolean;
  $isActive?: boolean;
  $hasValue?: boolean;
}>`
  color: ${({ $isOver, $isActive, $hasValue }) =>
    $isOver
      ? '#EA4335'
      : $isActive || $hasValue
        ? 'var(--grayscale-1000, #040405)'
        : 'var(--grayscale-500, #979ca5)'};

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

export const inputStyle = css`
  width: 100%;
  border: none;
  background: transparent;
  color: #9e9e9e;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  line-height: 160%;
  padding: 0;
  margin: 0;
  &:focus {
    outline: none;
  }
`;

export const FieldInputWrapper = styled.div<{ $isOver?: boolean }>`
  width: 100%;
  height: 3rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid ${({ $isOver }) => ($isOver ? '#EA4335' : '#e0e0e0')};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: ${({ $isOver }) => ($isOver ? '#EA4335' : colors.gdscBlue)};
  }

  &.open {
    border-color: ${colors.gdscBlue};
  }
`;

export const Input = styled.input`
  ${inputStyle}
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 25.6px */
`;

export const SelectWrapper = styled.div`
  display: flex;

  width: 480px;
  background: transparent;
  border: none;
  position: relative;
  align-items: flex-start;
  gap: 4px;

  & > div > div:first-child {
    position: relative;
    padding-right: 48px;
  }

  & > div > div:first-child::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background-image: url('/dropdownarrow.svg');

    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
    transition: transform 0.2s ease;
  }

  /* 열렸을 때 화살표 회전 */
  & > div > div:first-child.open::after {
    transform: translateY(-50%) rotate(180deg);
  }

  /* 기본 화살표 숨기기 */
  img,
  svg {
    display: none !important;
  }
`;

export const PreferredSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PreferredHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TeamSection = styled.section`
  display: flex;
  width: 600px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

export const TeamHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TeamTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 160%; /* 32px */
  color: #040405;
`;

export const TeamHint = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TeamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 280px;
  height: 50px;
`;

export const TeamLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 160%;
  color: #040405;
`;

export const TeamControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const StepButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #4285f4;
  background: #ffffff;
  color: #4285f4;
  font-size: 18px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      border-color: #e0e2e5;
      background: #e0e2e5;
      color: #c3c6cb;
      cursor: not-allowed;
    `}
`;

export const TeamCount = styled.span`
  width: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 160%;
  color: #000000;
`;

export const TextAreaWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  align-self: stretch;
  width: 100%;
  min-height: 400px;
  height: 520px;
  max-height: 680px;
  padding: 12px 16px;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
`;

export const QuillWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 320px;

  .ql-toolbar.ql-snow {
    flex: 0 0 auto;
    border: none;
    border-bottom: 1px solid #c3c6cb;
    padding: 8px 0 8px;
    min-height: 48px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
  }

  .ql-container.ql-snow {
    border: none;
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ql-editor {
    flex: 1;
    min-height: 0;
    font-size: 16px;
    line-height: 1.6;
    /* add extra top padding so caret/input starts one line lower (matches placeholder leading newline) */
    padding: 36px 0 36px 0;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .ql-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .ql-editor.ql-blank::before {
    color: var(--grayscale-500, #979ca5);
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
    white-space: pre-line;
    left: 0 !important;
    padding-left: 0;
  }

  .ql-editor p {
    padding-left: 0;
    margin-left: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 20px;
  max-width: 616px;
  width: 100%;
  margin: 0 auto;
`;

export const ButtonBase = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */

  cursor: pointer;
  border: none;
`;

export const PreviewButton = styled(ButtonBase)<{ disabled?: boolean }>`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  ${({ disabled }) =>
    disabled &&
    css`
      border-color: #e0e2e5;
      color: #c3c6cb;
      cursor: not-allowed;
      background: #f3f4f6;
    `}
`;

export const SubmitButton = styled(ButtonBase)<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#e0e2e5' : '#4285f4')};
  color: ${({ disabled }) => (disabled ? '#c3c6cb' : '#ffffff')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

export const ModalCard = styled.div`
  display: flex;
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%; /* 38.4px */
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  width: 460px;
  height: 50px;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  height: 50px;
  border: ${({ $variant }) => ($variant === 'secondary' ? '1.5px solid #4285F4' : 'none')};
  background: ${({ $variant }) => ($variant === 'secondary' ? '#fff' : '#4285F4')};
  color: ${({ $variant }) => ($variant === 'secondary' ? '#4285F4' : '#fff')};
  transition: 0.2s ease;
  &:hover {
    filter: brightness(0.97);
  }
`;
