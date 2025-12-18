import dynamic from 'next/dynamic';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

interface ProfileBioProps {
  isEditing: boolean;
  bioMarkdown: string;
  tempMarkdown: string;
  setTempMarkdown: (value: string) => void;
}

export default function ProfileBio({
  isEditing,
  bioMarkdown,
  tempMarkdown,
  setTempMarkdown,
}: ProfileBioProps) {
  return (
    <section css={!isEditing && wrapCss}>
      <h3 css={labelCss}>자기소개</h3>
      {isEditing ? (
        <div css={editorContainerCss} data-color-mode="light">
          <MDEditor
            value={tempMarkdown}
            onChange={val => setTempMarkdown(val || '')}
            height={400}
            preview="live"
            hideToolbar={false}
            visibleDragbar={true}
            textareaProps={{
              placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
            }}
          />
        </div>
      ) : (
        <div css={boxCss} data-color-mode="light">
          <MDPreview source={bioMarkdown} />
        </div>
      )}
    </section>
  );
}

const labelCss = css`
  min-width: 150px;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2rem;
`;

const wrapCss = css`
  margin-top: 3rem;
`;

const boxCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  outline: 1px ${colors.grayscale[400]} solid;
  outline-offset: -1px;
  padding: 32px 32px 32px 50px; /* 왼쪽 패딩을 늘려 불렛이 보일 공간 확보 */
  background: #fff;
  min-height: 400px;

  /* 마크다운 렌더링 스타일 강제 지정 */
  & .wmde-markdown {
    background-color: transparent;
    
    ul {
      list-style-type: disc !important; /* 불렛(점) 강제 활성화 */
      margin-left: 1.5rem !important;
      padding-left: 0 !important;
    }
    
    ol {
      list-style-type: decimal !important; /* 숫자 강제 활성화 */
      margin-left: 1.5rem !important;
      padding-left: 0 !important;
    }

    li {
      display: list-item !important; /* 블록 요소가 아닌 리스트 아이템으로 설정 */
    }
  }
`;

const editorContainerCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;

  /* 에디터 내부 편집기/미리보기 화면 스타일 */
  & .w-md-editor {
    border-radius: 8px;
    border: 1px solid #c3c6cb;
    
    /* 편집기 내부 리스트 스타일 복구 */
    .w-md-editor-content ul {
      list-style: disc !important;
      padding-left: 2rem !important;
    }
    .w-md-editor-content ol {
      list-style: decimal !important;
      padding-left: 2rem !important;
    }
  }
`;
