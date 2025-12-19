import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import {
  useApproveUserSignup,
  useRejectUserSignup,
  useResetRejectedUserToWaiting,
} from '@/lib/adminSubsScreening.api';
import styled from 'styled-components';

import { api } from '../../../../lib/api';
import { PageInsertNum } from '../../styles/AdminIdeaProject';
import Toggle, { ScreeningTab } from './Toggle';

type TabKey = ScreeningTab;

type Applicant = {
  id: number;
  name: string;
  email: string;
  generation: string;
  part: string;
  phone: string;
  school: string;
  status?: 'approved' | 'rejected' | 'pending';
};

type ApiGeneration = {
  id: number;
  generation: string;
  position: string;
  isMain: boolean;
};

type ApiUser = {
  id: number;
  userName: string;
  email: string;
  generations: ApiGeneration[];
  number: string;
  part: string;
  school: string;
  approvalStatus: 'APPROVED' | 'WAITING' | 'REJECTED';
};

type UsersResponse = {
  users: ApiUser[];
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
};

const dedupeApplicants = (list: Applicant[]) => {
  const map = new Map<string, Applicant>();
  list.forEach(applicant => {
    const key = `${applicant.id}-${applicant.email}`;
    if (!map.has(key)) {
      map.set(key, applicant);
    }
  });
  return Array.from(map.values());
};

const TABLE_VISIBLE_ROWS = 10;
const TABLE_ROW_HEIGHT = 80;

const AdminSubsScreening: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingList, setPendingList] = useState<Applicant[]>([]);
  const [historyList, setHistoryList] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [confirmName, setConfirmName] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'reset'>('approve');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const approveMut = useApproveUserSignup();
  const rejectMut = useRejectUserSignup();
  const resetMut = useResetRejectedUserToWaiting();
  const isDeciding = approveMut.isPending || rejectMut.isPending;

  // API 응답 데이터를 Applicant 형태로 변환
  const normalizeUser = (user: ApiUser): Applicant => {
    const mainGeneration = user.generations.find(g => g.isMain) || user.generations[0];

    return {
      id: user.id,
      name: user.userName,
      email: user.email,
      generation: mainGeneration?.generation || '',
      part: user.part,
      phone: user.number,
      school: user.school,
      status:
        user.approvalStatus === 'APPROVED'
          ? 'approved'
          : user.approvalStatus === 'REJECTED'
            ? 'rejected'
            : 'pending',
    };
  };

  // 모든 페이지의 데이터를 가져오는 함수
  useEffect(() => {
    let cancelled = false;

    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 첫 페이지를 먼저 가져와서 전체 페이지 수 확인
        const firstPageRes = await api.get<UsersResponse>('/admin/users', {
          params: { page: 0, size: 20 },
        });

        if (cancelled) return;

        const totalPages = firstPageRes.data.pageInfo.totalPages;
        const allUsers: ApiUser[] = [...firstPageRes.data.users];

        // 나머지 페이지들을 병렬로 가져오기
        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 1; page < totalPages; page++) {
            pagePromises.push(
              api.get<UsersResponse>('/admin/users', {
                params: { page, size: 20 },
              })
            );
          }

          const restPages = await Promise.all(pagePromises);
          restPages.forEach(res => {
            allUsers.push(...res.data.users);
          });
        }

        if (cancelled) return;

        const pending: Applicant[] = [];
        const history: Applicant[] = [];

        allUsers.forEach(user => {
          const normalized = normalizeUser(user);
          if (user.approvalStatus === 'WAITING') {
            pending.push(normalized);
          } else if (user.approvalStatus === 'APPROVED' || user.approvalStatus === 'REJECTED') {
            history.push(normalized);
          }
        });

        setPendingList(pending);
        setHistoryList(history);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to fetch users:', err);
        setError('사용자 정보를 불러오지 못했습니다.');
        setPendingList([]);
        setHistoryList([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAllUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedHistoryList = useMemo(() => dedupeApplicants(historyList), [historyList]);

  const applicants = useMemo(
    () => (activeTab === 'pending' ? pendingList : normalizedHistoryList),
    [activeTab, pendingList, normalizedHistoryList]
  );

  const totalPages = useMemo(
    () => Math.max(Math.ceil(applicants.length / TABLE_VISIBLE_ROWS), 1),
    [applicants.length]
  );

  const safeCurrentPage = useMemo(
    () => Math.min(Math.max(currentPage, 1), totalPages),
    [currentPage, totalPages]
  );

  const paginatedApplicants = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * TABLE_VISIBLE_ROWS;
    return applicants.slice(startIndex, startIndex + TABLE_VISIBLE_ROWS);
  }, [applicants, safeCurrentPage]);

  const pageSlots = useMemo(
    () => Array.from({ length: totalPages }, (_, idx) => idx + 1),
    [totalPages]
  );

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleTabChange = (nextTab: TabKey) => {
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(next);
  };

  const openApproveConfirm = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setConfirmName(applicant.name);
    setConfirmAction('approve');
    setShowConfirm(true);
    setShowComplete(false);
  };

  const openRejectConfirm = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setConfirmName(applicant.name);
    setConfirmAction('reject');
    setShowConfirm(true);
    setShowComplete(false);
  };

  const openResetConfirm = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setConfirmName(applicant.name);
    setConfirmAction('reset');
    setShowConfirm(true);
    setShowComplete(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplicant) return;

    try {
      setError(null);

      if (confirmAction === 'approve') {
        await approveMut.mutateAsync(selectedApplicant.id);
      } else if (confirmAction === 'reject') {
        await rejectMut.mutateAsync(selectedApplicant.id);
      } else {
        await resetMut.mutateAsync(selectedApplicant.id);
      }

      if (confirmAction === 'approve' || confirmAction === 'reject') {
        const statusToSet: Applicant['status'] =
          confirmAction === 'approve' ? 'approved' : 'rejected';

        setPendingList(prev => {
          const idx = prev.findIndex(
            a => a.id === selectedApplicant.id && a.email === selectedApplicant.email
          );
          if (idx === -1) return prev;

          const next = [...prev];
          const [removed] = next.splice(idx, 1);

          setHistoryList(prevHistory =>
            dedupeApplicants([...prevHistory, { ...removed, status: statusToSet }])
          );

          return next;
        });
      } else {
        setHistoryList(prev =>
          prev.filter(a => !(a.id === selectedApplicant.id && a.email === selectedApplicant.email))
        );

        setPendingList(prev => {
          const exists = prev.some(
            a => a.id === selectedApplicant.id && a.email === selectedApplicant.email
          );
          if (exists) return prev;
          return [{ ...selectedApplicant, status: 'pending' }, ...prev];
        });

        setActiveTab('pending');
        setCurrentPage(1);
      }

      setShowConfirm(false);
      setShowComplete(true);
      setSelectedApplicant(null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '처리에 실패했습니다.');
      setShowConfirm(false);
    }
  };

  const closeModals = () => {
    setShowConfirm(false);
    setShowComplete(false);
    setConfirmName(null);
    setSelectedApplicant(null);
  };

  return (
    <Container>
      <MainContent>
        <HeaderBlock>
          <Header>
            <Title>가입 심사</Title>
            <Subtitle>회원가입 후 관리자 심사를 기다리고 있는 회원입니다.</Subtitle>
            {error && <ErrorText>{error}</ErrorText>}
          </Header>
        </HeaderBlock>

        <TableCard>
          <ToggleCTNR>
            <Toggle
              activeTab={activeTab}
              pendingCount={pendingList.length}
              historyCount={normalizedHistoryList.length}
              onChange={handleTabChange}
            />
          </ToggleCTNR>

          {isLoading ? (
            <LoadingContainer>
              <LoadingText>데이터를 불러오는 중...</LoadingText>
            </LoadingContainer>
          ) : (
            <TableShell>
              <TableHeader>
                <IDHeader>
                  <IDHeaderCell>ID</IDHeaderCell>
                </IDHeader>
                <NameHeader>
                  <NameHeaderCell>이름</NameHeaderCell>
                </NameHeader>
                <EmailHeader>
                  <EmailHeaderCell>이메일</EmailHeaderCell>
                </EmailHeader>
                <GenerationHeader>
                  <GenerationHeaderCell>기수</GenerationHeaderCell>
                </GenerationHeader>
                <PartHeader>
                  <PartHeaderCell>파트</PartHeaderCell>
                </PartHeader>
                <PhoneHeader>
                  <PhoneHeaderCell>번호</PhoneHeaderCell>
                </PhoneHeader>
                <SchoolHeader>
                  <SchoolHeaderCell>학교</SchoolHeaderCell>
                </SchoolHeader>
                <StatusHeader>
                  <StatusHeaderCell>상태</StatusHeaderCell>
                </StatusHeader>
              </TableHeader>

              <TableBody>
                {paginatedApplicants.map((applicant, idx) => (
                  <TableRow key={`${activeTab}-${applicant.id}-${idx}`}>
                    <IDBody>
                      <IDBodyCell>{applicant.id}</IDBodyCell>
                    </IDBody>
                    <NameBody>
                      <NameBodyCell>{applicant.name}</NameBodyCell>
                    </NameBody>
                    <EmailBody>
                      <EmailBodyCell>{applicant.email}</EmailBodyCell>
                    </EmailBody>
                    <GenerationBody>
                      <GenerationBodyCell>{applicant.generation}</GenerationBodyCell>
                    </GenerationBody>
                    <PartBody>
                      <PartBodyCell>{applicant.part}</PartBodyCell>
                    </PartBody>
                    <PhoneBody>
                      <PhoneBodyCell>{applicant.phone}</PhoneBodyCell>
                    </PhoneBody>
                    <SchoolBody>
                      <SchoolBodyCell>{applicant.school}</SchoolBodyCell>
                    </SchoolBody>
                    <StatusBody>
                      {activeTab === 'pending' ? (
                        <>
                          <TrueStatusBodyCell>
                            <TrueActionButton
                              type="button"
                              onClick={() => openApproveConfirm(applicant)}
                            >
                              수락
                            </TrueActionButton>
                          </TrueStatusBodyCell>
                          <FalseStatusBodyCell>
                            <FalseActionButton
                              type="button"
                              onClick={() => openRejectConfirm(applicant)}
                            >
                              거절
                            </FalseActionButton>
                          </FalseStatusBodyCell>
                        </>
                      ) : (
                        <>
                          {applicant.status === 'approved' && (
                            <StatusApprovedText>수락됨</StatusApprovedText>
                          )}
                          {applicant.status === 'rejected' && (
                            <RefuseWrapper>
                              <StatusRejectedText>거절됨</StatusRejectedText>
                              <ReapplyButton
                                type="button"
                                onClick={() => openResetConfirm(applicant)}
                                disabled={isDeciding}
                              >
                                <ReapplyButtonText>재심사</ReapplyButtonText>
                              </ReapplyButton>
                            </RefuseWrapper>
                          )}
                        </>
                      )}
                    </StatusBody>
                  </TableRow>
                ))}
              </TableBody>
            </TableShell>
          )}
        </TableCard>

        <Pagination>
          <PageButton
            $isArrow
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            aria-label="Previous page"
          >
            <ArrowIcon $direction="left" />
          </PageButton>

          <PageNumberGroup>
            {pageSlots.map(pageNumber => {
              const isActive = pageNumber === safeCurrentPage;
              const isDisabled = pageNumber > totalPages;
              return (
                <PageInsertNum
                  key={pageNumber}
                  $active={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isDisabled || undefined}
                  onClick={() => {
                    if (isDisabled) return;
                    handlePageChange(pageNumber);
                  }}
                  style={
                    isDisabled
                      ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' }
                      : undefined
                  }
                >
                  {pageNumber}
                </PageInsertNum>
              );
            })}
          </PageNumberGroup>

          <PageButton
            $isArrow
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            aria-label="Next page"
          >
            <ArrowIcon $direction="right" />
          </PageButton>
        </Pagination>

        {showConfirm && (
          <ModalOverlay>
            <ModalCard>
              <ModalText>
                <ModalTitle>
                  {confirmAction === 'reset' ? (
                    <>
                      <ModalHighlight>{confirmName ?? '이름'}</ModalHighlight>의 가입 거절을{' '}
                      <ModalHighlight>반려</ModalHighlight>할까요?
                    </>
                  ) : (
                    <>
                      <ModalHighlight>{confirmName ?? '이름'}</ModalHighlight>의 가입을{' '}
                      <ModalHighlight>
                        {confirmAction === 'approve' ? '승인' : '거절'}
                      </ModalHighlight>
                      할까요?
                    </>
                  )}
                </ModalTitle>

                <ModalNote>
                  {confirmAction === 'approve'
                    ? '이 작업은 되돌릴 수 없습니다.'
                    : confirmAction === 'reject'
                      ? '거절한 후에 반려할 수 있습니다.'
                      : '다시 대기 상태로 되돌립니다.'}
                </ModalNote>
              </ModalText>

              <ModalActions>
                <PrimaryButton type="button" onClick={handleConfirmAction} disabled={isDeciding}>
                  {confirmAction === 'approve'
                    ? '승인하기'
                    : confirmAction === 'reject'
                      ? '거절하기'
                      : '반려하기'}
                </PrimaryButton>

                <SecondaryButton type="button" onClick={closeModals} disabled={isDeciding}>
                  취소
                </SecondaryButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}

        {showComplete && (
          <ModalOverlay>
            <ModalSuccessCard>
              <ModalHighlight>
                {confirmAction === 'approve'
                  ? '가입 승인이 완료되었습니다.'
                  : confirmAction === 'reject'
                    ? '가입 거절이 완료되었습니다.'
                    : '가입 거절 반려가 완료되었습니다.'}
              </ModalHighlight>

              <PrimarySuccessButton
                type="button"
                onClick={closeModals}
                style={{ width: '100%', marginTop: '12px' }}
              >
                <PrimaryButtonText>확인</PrimaryButtonText>
              </PrimarySuccessButton>
            </ModalSuccessCard>
          </ModalOverlay>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminSubsScreening;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 40px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
`;

const HeaderBlock = styled.div`
  width: 100%;
  margin-top: 90px;
`;

const Header = styled.div`
  display: flex;
  width: 472px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  color: #000;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const Subtitle = styled.h3`
  margin: 0;
  align-self: stretch;
  font-size: 20px;
  line-height: 160%;
  font-weight: 500;
  color: #626873;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const ErrorText = styled.div`
  color: #ea4335;
  font-size: 16px;
  margin-top: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.div`
  color: #626873;
  font-size: 18px;
`;

const TableCard = styled.div`
  width: 100%;
  max-width: 1120px;
  margin-top: 60px;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
`;

const ToggleCTNR = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0 8px;
  margin-bottom: 20px;
`;

const TableShell = styled.div`
  width: 100%;
  background: #fff;
`;

const TableHeader = styled.div`
  display: flex;
  height: 45px;
  padding: 0 8px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  align-self: stretch;
  background: var(--grayscale-200, #ededef);
`;

const IDHeader = styled.div`
  display: flex;
  width: 50px;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const IDHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  align-self: stretch;
`;

const NameHeader = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const NameHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const EmailHeader = styled.div`
  display: flex;
  width: 280px;
  padding: 8px;
  align-items: left;
  gap: 8px;
`;

const EmailHeaderCell = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const GenerationHeader = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const GenerationHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const PartHeader = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const PartHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const PhoneHeader = styled.div`
  display: flex;
  width: 180px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const PhoneHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const SchoolHeader = styled.div`
  display: flex;
  width: 160px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const SchoolHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const StatusHeader = styled.div`
  display: flex;
  width: 132px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const StatusHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const IDBody = styled.div`
  display: flex;
  width: 50px;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const IDBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  align-self: stretch;
`;

const NameBody = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const NameBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const EmailBody = styled.div`
  display: flex;
  width: 280px;
  height: 48px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const EmailBodyCell = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-align: left;
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const GenerationBody = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const GenerationBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const PartBody = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const PartBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const PhoneBody = styled.div`
  display: flex;
  width: 180px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const PhoneBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const SchoolBody = styled.div`
  display: flex;
  width: 160px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const SchoolBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const StatusBody = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TrueStatusBodyCell = styled.div`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 60px;
  height: 45px;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
`;

const FalseStatusBodyCell = styled.div`
  display: flex;
  width: 60px;
  height: 45px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--point-red, #ea4335);
  background: #fff;
`;

const TrueActionButton = styled.button`
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const FalseActionButton = styled.button`
  color: var(--point-red, #ea4335);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${TABLE_VISIBLE_ROWS * TABLE_ROW_HEIGHT}px;
`;

const TableRow = styled.div`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  height: 80px;
  padding: 0 8px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  align-self: stretch;
`;

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin: 120px 0 40px;
`;

const PageNumberGroup = styled.div`
  display: flex;
`;

export const PageButton = styled.button<{ $active?: boolean; $isArrow?: boolean }>`
  width: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  height: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  min-width: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  min-height: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  padding: 0;
  border-radius: 12px;
  border: ${({ $isArrow }) => ($isArrow ? '1px solid #d7dadd' : 'none')};
  font-size: ${({ $isArrow }) => ($isArrow ? '18px' : '17px')};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover:not(:disabled) {
    background: ${({ $isArrow, $active }) => {
      if ($active) return '#3f7bf5';
      if ($isArrow) return '#e9edf5';
      return '#f5f7fa';
    }};
    border-color: ${({ $isArrow, $active }) =>
      $isArrow ? ($active ? '#3f7bf5' : '#c9ced8') : 'transparent'};
  }

  &:active:not(:disabled) {
    transform: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    border-color: #e2e4e8;
    background: #f5f7fa;
    color: #a0a6ad;
    transform: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 16, 23, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalCard = styled.div`
  display: flex;
  width: 500px;
  height: 236px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const ModalHighlight = styled.span`
  font-weight: 700;
  font-size: 24px;
`;

const ModalNote = styled.div`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  white-space: nowrap;
`;

const StatusApprovedText = styled.span`
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  width: 132px;
  height: 29px;
`;

const StatusRejectedText = styled.span`
  color: var(--grayscale-500, #979ca5);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const ReapplyButton = styled.button`
  display: flex;
  width: 60px;
  height: 45px;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--point-red, #ea4335);
  background: #fff;
`;

const ModalActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  margin-top: 20px;
`;

const PrimarySuccessButton = styled.button`
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

const SecondaryButton = styled.button`
  flex: 1;
  height: 44px;
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

const ModalText = styled.div`
  width: 279px;
  height: 76px;
`;

const ModalSuccessCard = styled.div`
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

const PrimaryButtonText = styled.div`
  color: var(--grayscale-100, #f9f9fa);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const PrimaryButton = styled.button`
  flex: 1;
  height: 44px;
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

const RefuseWrapper = styled.div`
  display: flex;
  width: 132px;
  justify-content: space-between;
  align-items: center;
`;

const ReapplyButtonText = styled.div`
  color: var(--point-red, #ea4335);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

export const ArrowIcon = styled.span<{ $direction: 'left' | 'right' }>`
  width: 12px;
  height: 12px;
  display: inline-block;
  background-color: currentColor;
  mask: url(${({ $direction }) => ($direction === 'left' ? '/leftarrow.svg' : '/rightarrow.svg')})
    no-repeat center / contain;
  -webkit-mask: url(${({ $direction }) =>
      $direction === 'left' ? '/leftarrow.svg' : '/rightarrow.svg'})
    no-repeat center / contain;
  pointer-events: none;
`;
