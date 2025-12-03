import { css } from '@emotion/react';
import Button from '../Button';

interface ProfileEditButtonsProps {
  isPreviewMode: boolean;
  onPreview: () => void;
  onBackToEdit: () => void;
  onSave: () => void;
}

export default function ProfileEditButtons({
  isPreviewMode,
  onPreview,
  onBackToEdit,
  onSave,
}: ProfileEditButtonsProps) {
  return (
    <div css={editorButtonsCss}>
      <Button 
        title={isPreviewMode ? "작성화면으로 돌아가기" : "내 프로필 미리보기"}
        variant="secondary" 
        onClick={isPreviewMode ? onBackToEdit : onPreview}  
      />
      <Button 
        title="내 프로필 저장하기" 
        onClick={onSave} 
      />
    </div>
  );
}

const editorButtonsCss = css`
  display: flex;
  margin-top: 7rem;
  gap: 1rem;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 4rem;
  width: 100%;
  padding-left: 25%;
  padding-right: 25%;
`;