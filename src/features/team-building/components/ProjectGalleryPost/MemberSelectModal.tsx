import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { css } from '@emotion/react';
import type React from 'react';
import { createPortal } from 'react-dom';

import { colors } from '../../../../styles/constants';
import close from '../../assets/close.svg';
import FieldOfSearch from '../FieldOfSearch';
import MemberCard from './MemberCard';

export type Member = {
  id: string;
  name: string;
  badge: string;
  school: string;
};

// 임시 팀원 데이터
const MOCK_MEMBERS: Member[] = [
  { id: '1', name: '김준', badge: '25-26 Organizer', school: '성공회대학교' },
  { id: '2', name: '김기웅', badge: '25-26 Member', school: '성공회대학교' },
  { id: '3', name: '김규빈', badge: '25-26 Member', school: '성공회대학교' },
  { id: '4', name: '김보정', badge: '24-25 Core', school: '성공회대학교' },
  { id: '5', name: '박지민', badge: '25-26 Member', school: '성공회대학교' },
  { id: '6', name: '이도현', badge: '24-25 Member', school: '성공회대학교' },
  { id: '7', name: '김다은', badge: '25-26 Member', school: '성공회대학교' },
];

type TeamMemberSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectMember?: (member: Member) => void;
  selectedMemberIds?: string[];
};

export default function MemberSelectModal({
  open,
  onClose,
  onSelectMember,
  selectedMemberIds = [],
}: TeamMemberSelectModalProps) {
  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 모달 전체 박스 / 리스트 영역 ref
  const modalRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // 브라우저에서만 렌더되도록 하기 위함
  useEffect(() => {
    setMounted(true);
  }, []);

  // 모달이 열릴 때마다 검색 상태 초기화
  useEffect(() => {
    if (open) {
      setKeyword('');
      setHasSearched(false);
    }
  }, [open]);

  const trimmed = keyword.trim();

  const filteredMembers = useMemo(() => {
    if (!trimmed) return MOCK_MEMBERS;
    return MOCK_MEMBERS.filter(m => m.name.includes(trimmed));
  }, [trimmed]);

  const handleSelect = (member: Member) => {
    onSelectMember?.(member);
  };

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    setHasSearched(value.trim().length > 0);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setHasSearched(value.trim().length > 0);
    // 여기서 나중에 API 호출 가능
  };

  // ✅ wheel 이벤트를 전역에서 잡고, 타겟에 따라 배경 스크롤을 막을지 결정
  useEffect(() => {
    if (!open || !mounted) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Node;

      if (!modalRef.current) return;

      const isInModal = modalRef.current.contains(target);
      const listEl = listRef.current;
      const isInList = !!listEl && listEl.contains(target);

      // 모달 밖이면 배경 스크롤 허용
      if (!isInModal) return;

      // ✅ 리스트 영역 안에서의 처리
      if (isInList && listEl) {
        const deltaY = e.deltaY;
        const atTop = listEl.scrollTop === 0;
        const atBottom =
          Math.round(listEl.scrollTop + listEl.clientHeight) >= Math.round(listEl.scrollHeight);

        // 리스트가 아직 스크롤 여유가 있으면 → 리스트만 스크롤, 배경은 막기 위해 전파만 차단
        if ((!atTop && deltaY < 0) || (!atBottom && deltaY > 0)) {
          e.stopPropagation(); // 배경으로 이벤트 안 퍼지게
          return;
        }

        // 리스트 맨 위에서 위로 더 올리거나, 맨 아래에서 더 내리려고 하면
        // → 배경 스크롤 막기
        e.preventDefault();
        return;
      }

      // ✅ 모달 안(헤더/빈 공간 등)에서의 스크롤 → 배경 무조건 막기
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [open, mounted]);

  if (!open || !mounted) return null;

  const node = (
    <div css={overlayCss} onClick={onClose}>
      <div css={modalCss} ref={modalRef} onClick={e => e.stopPropagation()}>
        <header css={headerCss}>
          <h2 css={titleCss}>팀원 선택</h2>
          <button type="button" onClick={onClose}>
            <Image src={close} alt="닫힘" />
          </button>
        </header>

        <div css={bodyCss}>
          {/* 검색 영역 */}
          <div css={searchWrapCss}>
            <FieldOfSearch
              placeholder="팀원 이름을 검색해주세요."
              value={keyword}
              onChange={handleChangeKeyword}
              onSearch={handleSearch}
            />
          </div>

          {/* 팀원 리스트 영역 */}
          {hasSearched && (
            <div css={listWrapCss} ref={listRef}>
              {filteredMembers.length === 0 ? (
                <div css={emptyCss}>검색 결과가 없습니다.</div>
              ) : (
                filteredMembers.map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onSelect={handleSelect}
                    disabledSelect={selectedMemberIds.includes(member.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

const overlayCss = css`
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
`;

const modalCss = css`
  width: 600px;
  margin-top: 60px;
  max-width: calc(100% - 40px);
  border-radius: 8px;
  background: ${colors.white};
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.15);

  padding: 20px 20px 20px;
  display: flex;
  flex-direction: column;
`;

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const titleCss = css`
  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
  color: ${colors.grayscale[1000]};
`;

const bodyCss = css`
  display: flex;
  flex-direction: column;
`;

const searchWrapCss = css``;

const listWrapCss = css`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  max-height: 330px;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.grayscale[300]};
    border-radius: 999px;
  }
`;

const emptyCss = css`
  padding: 22px 0 32px;
  text-align: center;
  color: ${colors.grayscale[600]};
  font-size: 18px;
`;
