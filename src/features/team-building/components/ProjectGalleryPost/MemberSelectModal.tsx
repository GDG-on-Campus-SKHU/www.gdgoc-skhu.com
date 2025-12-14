import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { css } from '@emotion/react';
import type React from 'react';
import { createPortal } from 'react-dom';

import { useProjectGalleryMemberSearch } from '../../../../lib/projectGallery.api';
import { colors } from '../../../../styles/constants';
import close from '../../assets/close.svg';
import { ProjectGalleryMemberSearchItem, ProjectMemberBase } from '../../types/gallery';
import FieldOfSearch from '../FieldOfSearch';
import MemberCard from './MemberCard';

export type Member = ProjectMemberBase;

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectMember?: (member: Member) => void;
  selectedMemberIds?: number[];
};

export default function MemberSelectModal({
  open,
  onClose,
  onSelectMember,
  selectedMemberIds = [],
}: Props) {
  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // 검색 API: "검색 버튼/엔터"를 눌렀을 때만 hasSearched = true
  const { data, isFetching, isError } = useProjectGalleryMemberSearch(trimmed, {
    enabled: open && hasSearched && trimmed.length > 0,
  });

  // API 응답 → 폼에서 그대로 쓸 수 있는 Member(ProjectMemberBase)로 변환
  const members = useMemo<Member[]>(() => {
    const list = data?.members ?? [];
    return list.map((m: ProjectGalleryMemberSearchItem) => ({
      userId: m.userId,
      name: m.name,
      school: m.school,
      badge: m.generationAndPosition,
    }));
  }, [data]);

  const handleSelect = (member: Member) => {
    onSelectMember?.(member);
  };

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    // 입력만 했을 땐 리스트 안 보여주고, "검색" 수행 시에만 보여주려면 hasSearched는 여기서 건드리지 않음
    if (value.trim().length === 0) setHasSearched(false);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setHasSearched(value.trim().length > 0);
  };

  // wheel 이벤트를 전역에서 잡고, 조건에 따라 배경 스크롤을 막을지 결정
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

      // 리스트 영역 안에서의 처리
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

        // 그 이외 배경 스크롤 막기
        e.preventDefault();
        return;
      }

      // 모달 안(헤더/빈 공간 등)에서의 스크롤 → 배경 스크롤 막기
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
              {trimmed.length === 0 ? (
                <div>검색어를 입력해주세요.</div>
              ) : isFetching ? (
                <div css={emptyCss}>불러오는 중...</div>
              ) : isError ? (
                <div css={emptyCss}>팀원 목록을 불러오지 못했습니다.</div>
              ) : members.length === 0 ? (
                <div css={emptyCss}>검색 결과가 없습니다.</div>
              ) : (
                members.map(member => (
                  <MemberCard
                    key={member.userId}
                    member={member}
                    onSelect={handleSelect}
                    disabledSelect={selectedMemberIds.includes(member.userId)}
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
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  max-height: 370px;
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
  padding: 22px 0 42px;
  text-align: center;
  color: ${colors.grayscale[600]};
  font-size: 18px;
`;
