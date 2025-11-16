import { useState } from 'react';
import { css } from '@emotion/react';

import { GENERATIONS } from '../../constants/projectGalleryPost';
import ProjectDescriptionEditor from './ProjectDescriptionEditor';

export default function ProjectPostForm() {
  const [title, setTitle] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [generation, setGeneration] = useState('');
  const [serviceStatus, setServiceStatus] = useState<'RUNNING' | 'PAUSED'>('PAUSED');

  return (
    <form css={formCss} onSubmit={e => e.preventDefault()}>
      {/* 프로젝트 제목 */}
      <section css={fieldBlockCss}>
        <div css={labelRowCss}>
          <span css={labelCss}>프로젝트 제목</span>
          <span css={counterCss}>{title.length}/20</span>
        </div>
        <input
          css={textInputCss}
          placeholder="제목을 입력해주세요."
          maxLength={20}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </section>

      {/* 한 줄 소개 */}
      <section css={fieldBlockCss}>
        <div css={labelRowCss}>
          <span css={labelCss}>프로젝트 한 줄 소개</span>
          <span css={counterCss}>{oneLiner.length}/30</span>
        </div>
        <input
          css={textInputCss}
          placeholder="프로젝트를 간단하게 소개해주세요."
          maxLength={30}
          value={oneLiner}
          onChange={e => setOneLiner(e.target.value)}
        />
      </section>

      {/* 기수 */}
      <section css={fieldBlockCss}>
        <span css={labelCss}>기수</span>
        <select css={selectCss} value={generation} onChange={e => setGeneration(e.target.value)}>
          <option value="">기수를 선택해주세요.</option>
          {GENERATIONS.map(g => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </section>

      {/* 팀장 */}
      <section css={fieldBlockCss}>
        <span css={labelCss}>팀장</span>
        <div css={teamLeaderCardCss}>
          <div
            css={css`
              width: 32px;
              height: 32px;
              border-radius: 999px;
              background: #e5e7eb;
            `}
          />
          <div css={leaderInfoCss}>
            <div css={leaderNameRowCss}>
              <span>주현지</span>
              <span css={leaderBadgeCss}>25-26 Core</span>
            </div>
            <span
              css={css`
                font-size: 13px;
                color: #9aa0a6;
              `}
            >
              성공회대학교
            </span>
          </div>

          <div
            css={css`
              margin-left: auto;
              width: 260px;
            `}
          >
            <select css={selectCss} defaultValue="">
              <option value="">파트를 선택해주세요.</option>
              <option value="FE">프론트엔드</option>
              <option value="BE">백엔드</option>
              <option value="PM">기획</option>
              <option value="DESIGN">디자인</option>
              <option value="AI">AI/ML</option>
            </select>
          </div>
        </div>
      </section>

      {/* 팀원 */}
      <section css={fieldBlockCss}>
        <span css={labelCss}>팀원</span>
        <button type="button" css={teamMemberBoxCss}>
          + 팀원 추가
        </button>
      </section>

      {/* 서비스 운영 상태 */}
      <section css={statusGroupCss}>
        <span css={labelCss}>서비스 운영 상태</span>
        <div css={radioRowCss}>
          <label css={radioItemCss}>
            <input
              type="radio"
              name="serviceStatus"
              checked={serviceStatus === 'RUNNING'}
              onChange={() => setServiceStatus('RUNNING')}
            />
            <span>운영 중</span>
          </label>
          <label css={radioItemCss}>
            <input
              type="radio"
              name="serviceStatus"
              checked={serviceStatus === 'PAUSED'}
              onChange={() => setServiceStatus('PAUSED')}
            />
            <span>미운영 중</span>
          </label>
        </div>
      </section>

      {/* 프로젝트 설명 (에디터 영역) */}
      <section css={fieldBlockCss}>
        <span css={labelCss}>프로젝트 설명</span>
        <ProjectDescriptionEditor />
      </section>

      {/* 버튼 영역 */}
      <div css={btnRowCss}>
        <button type="button" css={previewBtnCss}>
          프로젝트 미리보기
        </button>
        <button type="button" css={submitBtnCss} disabled>
          프로젝트 전시하기
        </button>
      </div>
    </form>
  );
}

const formCss = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: #040405;
`;

const fieldBlockCss = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const labelRowCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const labelCss = css`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
`;

const counterCss = css`
  color: #979ca5;
  font-size: 16px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 25.6px;
  word-wrap: break-word;
`;

const textInputCss = css`
  width: 100%;
  height: 100%;
  padding: 14px 16px;
  background: white;
  border-radius: 8px;
  outline: 1px #c3c6cb solid;
  outline-offset: -1px;
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
  border: none;

  &::placeholder {
    color: #979ca5;
    font-size: 15px;
    font-weight: 500;
    line-height: 25.6px;
  }

  //   &:focus {
  //     border-color: #4285f4;
  //     box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.2);
  //   }
`;

const selectCss = css`
  width: 100%;
  height: 54px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  padding: 0 16px;
  font-size: 16px;
  outline: none;
  background: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23979CA5' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &::placeholder {
    color: #b0b5bd;
  }

  &:focus {
    border-color: #4285f4;
    box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.2);
  }
`;

const teamLeaderCardCss = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  background: #fafbff;
`;

const leaderInfoCss = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`;

const leaderNameRowCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
`;

const leaderBadgeCss = css`
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #4285f4;
  color: #4285f4;
  font-size: 12px;
  font-weight: 600;
  background: #f3f6ff;
`;

const teamMemberBoxCss = css`
  width: 100%;
  height: 56px;
  border-radius: 8px;
  border: 1px solid #c3d0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #3569f5;
  cursor: pointer;
  background: #f8fbff;
`;

const statusGroupCss = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const radioRowCss = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const radioItemCss = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const btnRowCss = css`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const previewBtnCss = css`
  min-width: 260px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid #3569f5;
  background: #fff;
  color: #3569f5;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f3f6ff;
  }
`;

const submitBtnCss = css`
  min-width: 260px;
  height: 54px;
  border-radius: 999px;
  border: none;
  background: #e5e7eb;
  color: #9ca3af;
  font-size: 16px;
  font-weight: 500;
  cursor: not-allowed;
`;
