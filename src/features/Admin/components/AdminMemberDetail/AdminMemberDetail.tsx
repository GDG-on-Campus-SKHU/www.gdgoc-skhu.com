/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  BanUser,
  DeleteUserGeneration,
  fetchUserInfo,
  UnbanUser,
  updateUserInfo,
  UpdateUserInfoData,
  UserStatus,
} from '@/lib/adminMember.api';
import { Generation } from '@/lib/mypageProfile.api';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';

type MemberDetail = {
  name: string;
  school: string;
  part: string;
  email: string;
  phoneNum: string;
  approveAt: string;

  status: UserStatus;

  bannedAt?: string;
  unbannedAt?: string;
  deletedAt?: string;

  banReason?: string;

  generations: Generation[];
};

const PART_OPTIONS = ['Design', 'PM', 'AI', 'Backend', 'Web', 'Mobile'];
const GENERATION_OPTIONS = ['25-26', '24-25', '23-24', '22-23'];
const POSITION_OPTIONS = ['Member', 'Core', 'Organizer'];

const AdminMemberDetail: NextPage = () => {
  const router = useRouter();
  const userIdParam = router.query.userId;

  const parsedUserId = typeof userIdParam === 'string' ? Number(userIdParam) : null;

  const [showSoftbanReleaseModal, setShowSoftbanReleaseModal] = useState(false);
  const [showSoftbanCompleteModal, setShowSoftbanCompleteModal] = useState(false);
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSoftbanModal, setShowSoftbanModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [softBanReason, setSoftBanReason] = useState('');
  const isModalOpen =
    showConfirmModal ||
    showCompleteModal ||
    showSoftbanModal ||
    showSoftbanCompleteModal ||
    showSoftbanReleaseModal;

  useEffect(() => {
    if (!parsedUserId) return;

    const fetchData = async () => {
      const data = await fetchUserInfo(parsedUserId);
      setMember({
        ...data,
        generations: Array.isArray(data.generations) ? data.generations : [],
      });
    };

    fetchData();
  }, [parsedUserId]);

  const statusDisplay = useMemo(() => {
    if (!member) return [];
    return getStatusDisplay(member);
  }, [member]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, mounted]);

  const sortedGenerations = useMemo(() => {
    const gens = Array.isArray(member?.generations) ? member.generations : [];

    return [...gens].sort((a, b) => {
      if (a.isMain === b.isMain) return 0;
      return a.isMain ? -1 : 1;
    });
  }, [member]);

  if (!parsedUserId || !member) {
    return <div>로딩 중...</div>;
  }

  function getStatusDisplay(member: MemberDetail): string[] {
    const result: string[] = [];

    if (member.status === 'DELETED') {
      result.push('탈퇴');
      return result;
    }

    if (member.bannedAt) {
      result.push(`소프트밴 (${member.bannedAt})`);
    }

    if (member.bannedAt && member.unbannedAt) {
      result.push(`정상 (${member.unbannedAt})`);
    }

    if (!member.bannedAt && member.status === 'ACTIVE') {
      result.push('정상');
    }

    return result;
  }

  const setField = <K extends keyof MemberDetail>(key: K, value: MemberDetail[K]) => {
    setMember(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleMainGenerationChange = (index: number) => {
    setMember(prev =>
      prev
        ? {
            ...prev,
            generations: prev.generations.map((gen, i) => ({
              ...gen,
              isMain: i === index,
            })),
          }
        : prev
    );
  };

  const handleGenerationChange = (index: number, value: string) => {
    setMember(prev =>
      prev
        ? {
            ...prev,
            generations: prev.generations.map((gen, i) =>
              i === index ? { ...gen, generation: value } : gen
            ),
          }
        : prev
    );
  };

  const handlePositionChange = (index: number, value: string) => {
    setMember(prev =>
      prev
        ? {
            ...prev,
            generations: prev.generations.map((gen, i) =>
              i === index ? { ...gen, position: value } : gen
            ),
          }
        : prev
    );
  };

  const handleAddGeneration = () => {
    setMember(prev =>
      prev
        ? {
            ...prev,
            generations: [
              ...prev.generations,
              {
                generation: '',
                position: 'MEMBER',
                isMain: prev.generations.length === 0,
                _tempId: crypto.randomUUID(), // ⭐️ 핵심
              } as any,
            ],
          }
        : prev
    );
  };

  const buildUpdatePayload = (member: MemberDetail): UpdateUserInfoData => ({
    school: member.school,
    part: partUiToEnum(member.part),
    generations: member.generations
      .filter(gen => gen.generation.trim() !== '')
      .map(gen => ({
        ...(gen.id != null && { id: gen.id }),
        generation: gen.generation,
        position: positionToEnum(gen.position),
        isMain: gen.isMain,
      })),
  });

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!member || !parsedUserId) return;
    console.log(member.generations);
    try {
      const payload = buildUpdatePayload(member);

      console.log('UPDATE PAYLOAD', payload); // 디버깅용
      await updateUserInfo(parsedUserId, payload);

      setShowConfirmModal(false);
      setShowCompleteModal(true);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const positionToEnum = (position: string) => {
    if (['MEMBER', 'CORE', 'ORGANIZER'].includes(position)) {
      return position;
    }

    switch (position) {
      case 'Member':
        return 'MEMBER';
      case 'Core':
        return 'CORE';
      case 'Organizer':
        return 'ORGANIZER';
      default:
        throw new Error(`Invalid position: ${position}`);
    }
  };

  const partUiToEnum = (part: string) => {
    switch (part) {
      case 'Design':
        return 'DESIGN';
      case 'PM':
        return 'PM';
      case 'AI':
        return 'AI';
      case 'Backend':
        return 'BACKEND';
      case 'Web':
        return 'WEB';
      case 'Mobile':
        return 'MOBILE';
      default:
        throw new Error(`Invalid part: ${part}`);
    }
  };

  const enumToPosition = (value: string): 'Member' | 'Core' | 'Organizer' => {
    switch (value) {
      case 'MEMBER':
        return 'Member';
      case 'CORE':
        return 'Core';
      case 'ORGANIZER':
        return 'Organizer';
      default:
        throw new Error(`Invalid position enum: ${value}`);
    }
  };

  const handleCloseModals = () => {
    setShowConfirmModal(false);
    setShowCompleteModal(false);
    setShowSoftbanModal(false);
    setShowSoftbanCompleteModal(false);
    setShowSoftbanReleaseModal(false);
    setSoftBanReason('');
  };

  const handleOpenSoftbanModal = () => {
    setShowSoftbanModal(true);
  };

  const handleApplySoftban = async () => {
    if (!parsedUserId) return;
    if (!softBanReason.trim()) {
      alert('소프트밴 사유를 입력해주세요.');
      return;
    }

    try {
      await BanUser(parsedUserId, { reason: softBanReason });

      const updatedMember = await fetchUserInfo(parsedUserId);
      setMember(updatedMember);

      setShowSoftbanModal(false);
      setShowSoftbanCompleteModal(true);
      setSoftBanReason('');
    } catch (e) {
      console.error(e);
      alert('소프트밴 처리에 실패했습니다.');
    }
  };

  const handleReleaseSoftban = async () => {
    if (!parsedUserId) return;

    try {
      await UnbanUser(parsedUserId);

      const updatedMember = await fetchUserInfo(parsedUserId);
      setMember(updatedMember);

      setShowSoftbanReleaseModal(true);
    } catch (e) {
      console.error(e);
      alert('소프트밴 해제에 실패했습니다.');
    }
  };

  const getGenerationKey = (gen: Generation, index: number) => {
    return gen.id ?? `temp-${index}`;
  };

  const handleUserProfile = (userId: number) => {
    router.push(`/admin-member/${userId}/profile`);
  };

  const handleDeleteGeneration = async (gen: Generation) => {
    setMember(prev => {
      if (!prev) return prev;

      const filtered = prev.generations.filter(g => g !== gen);

      if (!filtered.some(g => g.isMain) && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isMain: true };
      }

      return { ...prev, generations: filtered };
    });

    if (gen.id) {
      try {
        await DeleteUserGeneration(gen.id);
      } catch (e) {
        console.error(e);
        alert('역할 삭제에 실패했습니다.');
      }
    }
  };

  const isDeleted = member.status === 'DELETED';
  const generations = Array.isArray(member?.generations) ? member.generations : [];
  const generationCount = generations.length;

  return (
    <Container>
      <MainContent>
        <Header>
          <Title>멤버 관리</Title>
          <Subtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</Subtitle>
        </Header>

        <DetailHeader>
          <MemberName>{member.name}</MemberName>
          {!isDeleted && (
            <ProfileButton type="button" onClick={() => handleUserProfile(parsedUserId)}>
              프로필 보기
            </ProfileButton>
          )}
        </DetailHeader>

        <ContentCard>
          {isDeleted ? (
            <FormGrid>
              <FieldGroup>
                <FieldLabel>학교</FieldLabel>
                <MutedInput value={member.school ?? ''} readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>파트</FieldLabel>
                <MutedInput value={member.part ?? ''} readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>이메일</FieldLabel>
                <MutedInput value={member.email ?? ''} readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>전화번호</FieldLabel>
                <MutedInput value={member.phoneNum ?? ''} readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>가입일</FieldLabel>
                <MutedInput value={member.approveAt ?? ''} readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>상태</FieldLabel>
                <MutedInput value="탈퇴" readOnly />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>탈퇴일</FieldLabel>
                <MutedInput value={member.deletedAt ?? ''} readOnly />
              </FieldGroup>
            </FormGrid>
          ) : (
            <>
              {/* ✅ 기존 FormGrid – 편집 UI */}
              <FormGrid>
                <FieldGroup>
                  <FieldLabel>학교</FieldLabel>
                  <Input
                    value={member.school ?? ''}
                    onChange={e => setField('school', e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>파트</FieldLabel>
                  <SelectBoxWrapper>
                    <SelectBoxBasic
                      options={PART_OPTIONS}
                      value={[member.part]}
                      onChange={selected => setField('part', selected[0] ?? member.part)}
                    />
                  </SelectBoxWrapper>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>이메일</FieldLabel>
                  <MutedInput value={member.email ?? ''} readOnly />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>전화번호</FieldLabel>
                  <MutedInput value={member.phoneNum ?? ''} readOnly />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>가입일</FieldLabel>
                  <MutedInput value={member.approveAt ?? ''} readOnly />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>상태</FieldLabel>
                  <StatusHistoryBox>
                    {statusDisplay.map((text, idx) => (
                      <StatusHistoryItem key={idx}>{text}</StatusHistoryItem>
                    ))}
                  </StatusHistoryBox>
                </FieldGroup>
              </FormGrid>

              {member.status === 'BANNED' && member.banReason && (
                <SoftbanReasonSection>
                  <SoftbanReasonLabel>소프트밴 사유</SoftbanReasonLabel>
                  <SoftbanReasonBox>
                    <SoftbanReasonText>{member.banReason}</SoftbanReasonText>
                  </SoftbanReasonBox>
                </SoftbanReasonSection>
              )}

              {/* 역할 */}
              <RoleHeaderRow>
                <RoleHeader>
                  <RoleTitle>역할</RoleTitle>
                  <RoleHelper>선택된 역할이 기본 역할로 설정됩니다.</RoleHelper>
                </RoleHeader>
                <AddButtonCTNR>
                  <AddButton type="button" onClick={handleAddGeneration}>
                    추가
                  </AddButton>
                </AddButtonCTNR>
              </RoleHeaderRow>

              <RoleList>
                {sortedGenerations.map((gen, index) => (
                  <RoleRow key={getGenerationKey(gen, index)}>
                    <Radio
                      checked={gen.isMain}
                      onChange={() => handleMainGenerationChange(index)}
                    />

                    <SelectBoxBasic
                      options={GENERATION_OPTIONS}
                      value={gen.generation ? [gen.generation] : []}
                      onChange={selected => handleGenerationChange(index, selected?.[0] ?? '')}
                    />

                    <SelectBoxBasic
                      options={POSITION_OPTIONS}
                      value={[enumToPosition(gen.position)]}
                      onChange={selected =>
                        handlePositionChange(index, positionToEnum(selected?.[0] ?? 'Member'))
                      }
                    />

                    <DeleteIconCTNR
                      src="/deleteicon_admin.svg"
                      alt="삭제"
                      width={16}
                      height={16}
                      onClick={() => handleDeleteGeneration(gen)}
                    />
                  </RoleRow>
                ))}
              </RoleList>

              <ActionRow $roleCount={generationCount}>
                {member.status === 'BANNED' ? (
                  <OutlineDangerButton onClick={handleReleaseSoftban}>
                    소프트밴 해제
                  </OutlineDangerButton>
                ) : member.status === 'ACTIVE' ? (
                  <OutlineDangerButton onClick={handleOpenSoftbanModal}>
                    소프트밴
                  </OutlineDangerButton>
                ) : null}

                <PrimaryButton type="button" onClick={handleSaveClick}>
                  저장하기
                </PrimaryButton>
              </ActionRow>
            </>
          )}
        </ContentCard>
      </MainContent>
      {mounted && isModalOpen
        ? createPortal(
            <DetailModalOverlay>
              {showSoftbanModal && (
                <SoftbanModalCard onClick={e => e.stopPropagation()}>
                  <SoftbanHeader>
                    <SoftbanTitle>소프트밴</SoftbanTitle>
                    <SoftbanCloseButton
                      type="button"
                      onClick={handleCloseModals}
                      aria-label="모달 닫기"
                    >
                      <SoftbanCloseIcon src="/X.svg" alt="닫기" width={24} height={24} />
                    </SoftbanCloseButton>
                  </SoftbanHeader>
                  <SoftbanArea>
                    <SoftbanTextarea
                      placeholder="소프트밴 사유를 입력해주세요."
                      value={softBanReason}
                      onChange={e => setSoftBanReason(e.target.value)}
                    />
                  </SoftbanArea>
                  <SoftbanActions>
                    <SoftbanApplyButton type="button" onClick={handleApplySoftban}>
                      <SoftbanApplyButtonText>적용하기</SoftbanApplyButtonText>
                    </SoftbanApplyButton>
                  </SoftbanActions>
                </SoftbanModalCard>
              )}

              {showConfirmModal && (
                <DetailModalCard>
                  <DetailModalText>
                    <DetailModalTitle>
                      회원 정보를 변경하시겠습니까? 변경 사항은 즉시 적용됩니다.
                    </DetailModalTitle>
                  </DetailModalText>
                  <DetailModalActions>
                    <DetailModalPrimaryButton type="button" onClick={handleConfirmSave}>
                      <DetailModalPrimaryButtonText>변경 적용</DetailModalPrimaryButtonText>
                    </DetailModalPrimaryButton>
                    <DetailModalSecondaryButton type="button" onClick={handleCloseModals}>
                      <DetailModalSecondaryButtonText>취소</DetailModalSecondaryButtonText>
                    </DetailModalSecondaryButton>
                  </DetailModalActions>
                </DetailModalCard>
              )}

              {showCompleteModal && (
                <DetailModalSuccessCard>
                  <DetailModalHighlight>수정이 완료되었습니다.</DetailModalHighlight>
                  <DetailModalPrimarySuccessButton type="button" onClick={handleCloseModals}>
                    <DetailModalPrimaryButtonText>확인</DetailModalPrimaryButtonText>
                  </DetailModalPrimarySuccessButton>
                </DetailModalSuccessCard>
              )}
              {showSoftbanCompleteModal && (
                <SoftbanCompleteModalCard>
                  <SoftbanCompleteContent>
                    <SoftbanCompleteName>{member.name}</SoftbanCompleteName>
                    <SoftbanCompleteMessage>소프트밴 처리가 완료되었습니다.</SoftbanCompleteMessage>
                  </SoftbanCompleteContent>
                  <SoftbanCompleteButton type="button" onClick={handleCloseModals}>
                    <SoftbanCompleteButtonText>확인</SoftbanCompleteButtonText>
                  </SoftbanCompleteButton>
                </SoftbanCompleteModalCard>
              )}
              {showSoftbanReleaseModal && (
                <SoftbanCompleteModalCard>
                  <SoftbanCompleteContent>
                    <SoftbanCompleteName>{member.name}</SoftbanCompleteName>
                    <SoftbanReleaseMessage>소프트밴 해제가 완료되었습니다.</SoftbanReleaseMessage>
                  </SoftbanCompleteContent>
                  <SoftbanCompleteButton type="button" onClick={handleCloseModals}>
                    <SoftbanCompleteButtonText>확인</SoftbanCompleteButtonText>
                  </SoftbanCompleteButton>
                </SoftbanCompleteModalCard>
              )}
            </DetailModalOverlay>,
            document.body
          )
        : null}
    </Container>
  );
};

export default AdminMemberDetail;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
  overflow: visible;
`;

const MenuItem = styled.div`
  align-self: stretch;
  background-color: #454b54;
  border-bottom: 1px solid #626873;
  display: flex;
  height: 50px;
  align-items: center;
  padding: 12px 28px;
  line-height: 160%;
  font-weight: 500;
  cursor: pointer;

  &:first-child {
    border-top: 1px solid #626873;
  }

  &:hover {
    background-color: #353a40;
  }
`;

const MenuItemActive = styled(MenuItem)`
  background: linear-gradient(#353a40, #353a40), #25282c;
  font-weight: 700;
  justify-content: space-between;
`;

const MenuArrowIcon = styled(Image)`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const MainContent = styled.main`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  max-width: 472px;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  color: #000;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  margin: 0;
`;

const Subtitle = styled.h3`
  margin: 0;
  align-self: stretch;
  font-size: 20px;
  line-height: 160%;
  font-weight: 500;
  color: #626873;
`;

const ContentCard = styled.div`
  width: 100%;
  max-width: 1120px;
  margin-top: 40px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 8px 0 0;
  box-sizing: border-box;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

const MemberName = styled.h2`
  color: var(--grayscale-1000, #040405);
  margin: 0;
  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;
const ProfileButton = styled.button`
  width: 200px;
  height: 50px;
  border-radius: 6px;
  border: 1px solid #4285f4;
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  &:hover {
    background: rgba(66, 133, 244, 0.08);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 40px;
  column-gap: 20px;

  box-sizing: border-box;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HiddenFieldGroup = styled(FieldGroup)`
  visibility: hidden;
`;

const FieldLabel = styled.label`
  color: #040405;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InputBase = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  padding: 0 14px;
  font-size: 16px;
  color: #15171a;
  box-sizing: border-box;
`;

const Input = styled(InputBase)``;

const MutedInput = styled(InputBase)`
  background: #f8f9fb;
  border-color: #f2f4f7;
`;

const SelectBoxWrapper = styled.div`
  position: relative;
  z-index: 15000;
  isolation: isolate;
  height: 50px;
  overflow: visible;

  .admin-member-select {
    position: relative;
    z-index: 15000;
    height: 100%;
    width: 100%;
  }

  .admin-member-select > div:first-of-type {
    height: 100%;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    padding: 0 14px;
    box-sizing: border-box;
    background: #fff url('/dropdownarrow.svg') no-repeat calc(100% - 16px) center;
    font-size: 16px;
    color: #15171a;
    min-width: 0;
  }

  /* 드롭다운 전체 표시 및 기본 화살표 숨기기 */
  .admin-member-select > div:last-of-type {
    position: absolute;
    left: 0;
    right: 0;
    max-height: none;
    z-index: 15000;
  }

  .admin-member-select svg {
    display: none !important;
  }
`;

const RoleHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const RoleHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RoleTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #040405;
`;

const RoleHelper = styled.span`
  color: #626873;
  font-size: 14px;
  font-weight: 500;
`;

const AddButton = styled.button`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */

  &:hover {
    background: rgba(66, 133, 244, 0.08);
  }
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
  max-width: 100%;
  box-sizing: border-box;
`;

const RoleRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 32px minmax(0, 1fr) minmax(0, 1fr) 50px;
  align-items: center;
  column-gap: 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  &:focus-within {
    z-index: 100;
  }
  /* 첫 번째 컬럼 뒤 gap은 건너뛰고, 이후 컬럼 간격만 적용 */
  & > *:nth-child(2) {
    margin-left: -20px;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #4285f4;
  display: grid;
  place-content: center;
  cursor: default;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: scale(0);
    background: #4285f4;
    transition: transform 0.1s ease;
  }

  &:checked::before {
    transform: scale(1);
  }
`;

const DeleteIconCTNR = styled(Image)`
  display: flex;
  width: 50px;
  height: 50px;
  padding: 7.5px;

  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1.25px solid var(--grayscale-400, #c3c6cb);
`;

const ActionRow = styled.div<{ $roleCount: number }>`
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
  margin: ${props => (props.$roleCount === 1 ? '120px 0 40px' : '120px 0 40px')};
`;

const OutlineDangerButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #f44242;
  background: #fff;
  color: #f44242;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(244, 66, 66, 0.08);
  }
`;

const PrimaryButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  border: none;
  background: #4285f4;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;

const AddButtonCTNR = styled.div`
  display: flex;
  width: 100px;
  height: 40px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
`;

const SoftbanModalCard = styled.div`
  border-radius: 12px;
  background: #fff;
  display: flex;
  width: 700px;
  padding: 40px;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
`;

const SoftbanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const SoftbanTitle = styled.h3`
  margin: 0;
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SoftbanCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const SoftbanCloseIcon = styled(Image)`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const SoftbanTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  background: transparent;

  &::placeholder {
    color: var(--grayscale-500, #979ca5);
  }
`;

const SoftbanActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 12px;
`;

const SoftbanApplyButton = styled.button`
  border-radius: 8px;
  border: 1px solid var(--point-red, #ea4335);
  background: #fff;
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
`;

const DetailModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 16, 23, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12000;
  padding: 16px;
`;

const DetailModalCard = styled.div`
  display: flex;
  width: 500px;
  height: 226px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const DetailModalText = styled.div`
  width: 279px;
  height: 76px;
`;

const DetailModalTitle = styled.h3`
  width: 294px;
  height: 76px;
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const DetailModalHighlight = styled.span`
  font-weight: 700;
  font-size: 24px;
`;

const DetailModalActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const DetailModalPrimaryButton = styled.button`
  flex: 1;
  height: 50px;
  border: none;
  border-radius: 8px;
  background: #4285f4;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;

const DetailModalSecondaryButton = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #ffffff;
  color: #4285f4;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: #4285f4;
    background: rgba(66, 133, 244, 0.08);
  }
`;

const DetailModalSuccessCard = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const DetailModalPrimarySuccessButton = styled.button`
  width: 460px;
  height: 50px;
  border: none;
  border-radius: 8px;
  background: #4285f4;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;

const DetailModalPrimaryButtonText = styled.div`
  color: var(--grayscale-100, #f9f9fa);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const DetailModalSecondaryButtonText = styled.div`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const SoftbanArea = styled.div`
  display: flex;
  width: 100%;
  height: 160px;
  padding: 16px 20px;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  box-sizing: border-box;
`;

const SoftbanApplyButtonText = styled.div`
  color: var(--point-red, #ea4335);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const SoftbanCompleteModalCard = styled.div`
  display: flex;
  width: 500px;
  height: 240px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const SoftbanCompleteContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SoftbanCompleteName = styled.h2`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SoftbanCompleteMessage = styled.p`
  margin: 0;
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const SoftbanCompleteButton = styled.button`
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
  &:hover {
    background: #3367d6;
  }
`;

const SoftbanCompleteButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const SoftbanReasonSection = styled.div`
  display: flex;
  width: 540px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const SoftbanReasonLabel = styled.label`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SoftbanReasonBox = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  background: var(--grayscale-100, #f9f9fa);
`;

const SoftbanReasonText = styled.p`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  white-space: pre-line;
`;

const SoftbanReleaseMessage = styled.p`
  margin: 0;
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const StatusHistoryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f8f9fb;
  border: 1px solid #f2f4f7;
  min-height: 48px;
  box-sizing: border-box;
`;

const StatusHistoryItem = styled.span`
  color: #15171a;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;
