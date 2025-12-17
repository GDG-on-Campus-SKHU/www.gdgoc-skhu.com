import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  addParticipant,
  type ApprovedUser,
  getApprovedUsers,
  getModifiableProject,
  type Participant,
  removeParticipant,
} from 'src/lib/adminProject.api';

import styles from '../../styles/ParticipantManagement.module.css';

type LocalMember = {
  id: number;
  school: string;
  name: string;
  generation: string;
  part: string;
};

// 더미 데이터 (API 실패 시 fallback)
const DUMMY_MEMBERS: LocalMember[] = [
  { id: 1, school: '성공회대학교', name: '강민정', generation: '25-26', part: 'Design' },
  { id: 2, school: '성공회대학교', name: '강우혁', generation: '25-26', part: 'BE' },
  { id: 3, school: '성공회대학교', name: '권지후', generation: '25-26', part: 'BE' },
  { id: 4, school: '성공회대학교', name: '김규빈', generation: '25-26', part: 'Design' },
  { id: 5, school: '성공회대학교', name: '김기웅', generation: '25-26', part: 'BE' },
  { id: 6, school: '성공회대학교', name: '김보민', generation: '25-26', part: 'BE' },
  { id: 7, school: '성공회대학교', name: '김석환', generation: '25-26', part: 'BE' },
  { id: 8, school: '성공회대학교', name: '김선호', generation: '25-26', part: 'PM' },
  { id: 9, school: '성공회대학교', name: '김태우', generation: '25-26', part: 'BE' },
  { id: 10, school: '성공회대학교', name: '김다은', generation: '25-26', part: 'FE' },
  { id: 11, school: '성신여자대학교', name: '주현지', generation: '25-26', part: 'Design' },
  { id: 12, school: '성신여자대학교', name: '이서영', generation: '25-26', part: 'PM' },
  { id: 13, school: '성신여자대학교', name: '이솔', generation: '25-26', part: 'PM' },
  { id: 14, school: '서울과학기술대학교', name: '한시연', generation: '25-26', part: 'FE' },
];

const GENERATIONS = ['전체', '25-26', '24-25', '23-24'];
const SCHOOLS = [
  '전체',
  '성공회대학교 외 4개',
  '성공회대학교',
  '성신여자대학교',
  '서울과학기술대학교',
  '한양대학교',
  '서울대학교',
];

type ParticipantManagementProps = {
  projectId: number;
};

const ParticipantManagement = ({ projectId }: ParticipantManagementProps) => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 필터 상태
  const [selectedGeneration, setSelectedGeneration] = useState('25-26');
  const [selectedSchool, setSelectedSchool] = useState('성공회대학교 외 4개');
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);

  // 멤버 데이터
  const [allMembers, setAllMembers] = useState<LocalMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<LocalMember[]>([]);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 승인된 유저 목록 조회
        try {
          const usersData = await getApprovedUsers();
          const mappedMembers: LocalMember[] = Array.isArray(usersData)
            ? usersData.map((m: ApprovedUser) => ({
                id: m.userId,
                school: m.university,
                name: m.name,
                generation: m.generation,
                part: m.part,
              }))
            : [];
          setAllMembers(mappedMembers);
        } catch (error) {
          console.error('멤버 목록 조회 실패:', error);
          setAllMembers(DUMMY_MEMBERS);
        }

        // 참여자 목록 조회 (getModifiableProject에서 participants 추출)
        try {
          const projectData = await getModifiableProject();
          const mappedParticipants: LocalMember[] = projectData.participants.map(
            (p: Participant) => ({
              id: p.participantId,
              school: p.school,
              name: p.name,
              generation: p.generation,
              part: p.part,
            })
          );
          setSelectedMembers(mappedParticipants);
        } catch (error) {
          console.error('참여자 목록 조회 실패:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // 필터링된 멤버 목록
  const filteredMembers = allMembers.filter(member => {
    const matchGeneration =
      !selectedGeneration ||
      selectedGeneration === '전체' ||
      member.generation === selectedGeneration;
    // '성공회대학교 외 4개' 또는 '전체' 선택 시 모든 학교 멤버 표시
    const matchSchool =
      !selectedSchool ||
      selectedSchool === '전체' ||
      selectedSchool === '성공회대학교 외 4개' ||
      member.school === selectedSchool;
    return matchGeneration && matchSchool;
  });

  // 멤버 선택/해제 토글
  const handleToggleMember = async (member: LocalMember) => {
    const isSelected = selectedMembers.some(selected => selected.id === member.id);

    try {
      if (isSelected) {
        // 참여자 제거 API 호출
        await removeParticipant(projectId, member.id);
        setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
      } else {
        // 참여자 추가 API 호출
        await addParticipant(projectId, member.id);
        setSelectedMembers(prev => [...prev, member]);
      }
    } catch (error) {
      console.error('참여자 업데이트 실패:', error);
      alert('참여자 업데이트에 실패했습니다.');
    }
  };

  // 멤버가 선택되었는지 확인
  const isMemberSelected = (memberId: number) => {
    return selectedMembers.some(selected => selected.id === memberId);
  };

  // 멤버 선택 해제
  const handleDeselectMember = async (memberId: number) => {
    try {
      await removeParticipant(projectId, memberId);
      setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('참여자 제거 실패:', error);
      alert('참여자 제거에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 기수 + 학교 필터 영역 */}
      <div className={styles.filterRow}>
        {/* 기수 셀렉트박스 */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>기수</span>
          <div className={styles.selectBox} onClick={() => setIsGenerationOpen(!isGenerationOpen)}>
            <div className={styles.selectHeader}>
              <span className={selectedGeneration ? styles.selectValue : styles.selectPlaceholder}>
                {selectedGeneration || '선택'}
              </span>
              <Image
                src="/dropdownarrow.svg"
                alt=""
                width={20}
                height={20}
                className={`${styles.selectArrow} ${isGenerationOpen ? styles.selectArrowOpen : ''}`}
              />
            </div>
            {isGenerationOpen && (
              <div className={styles.selectDropdown}>
                {GENERATIONS.map(gen => (
                  <div
                    key={gen}
                    className={styles.selectOption}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedGeneration(gen === '전체' ? '' : gen);
                      setIsGenerationOpen(false);
                    }}
                  >
                    {gen}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 학교 셀렉트박스 */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>학교</span>
          <div className={styles.selectBox} onClick={() => setIsSchoolOpen(!isSchoolOpen)}>
            <div className={styles.selectHeader}>
              <span className={selectedSchool ? styles.selectValue : styles.selectPlaceholder}>
                {selectedSchool || '선택'}
              </span>
              <Image
                src="/dropdownarrow.svg"
                alt=""
                width={20}
                height={20}
                className={`${styles.selectArrow} ${isSchoolOpen ? styles.selectArrowOpen : ''}`}
              />
            </div>
            {isSchoolOpen && (
              <div className={styles.selectDropdown}>
                {SCHOOLS.map(school => (
                  <div
                    key={school}
                    className={styles.selectOption}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedSchool(school === '전체' ? '' : school);
                      setIsSchoolOpen(false);
                    }}
                  >
                    {school}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className={styles.tableRow}>
        {/* 선택된 멤버 테이블 */}
        <div className={styles.tableGroup}>
          <div className={styles.tableTitle}>
            <span className={styles.tableTitleText}>선택된 멤버</span>
            <span className={styles.tableTitleCount}>{selectedMembers.length}명</span>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.cellSchool}>
                <span className={styles.headerText}>학교</span>
              </div>
              <div className={styles.cellName}>
                <span className={styles.headerText}>이름</span>
              </div>
              <div className={styles.cellGeneration}>
                <span className={styles.headerText}>기수</span>
              </div>
              <div className={styles.cellPart}>
                <span className={styles.headerText}>파트</span>
              </div>
            </div>
            <div className={styles.tableBody}>
              {(() => {
                // 학교별로 정렬
                const sortedMembers = [...selectedMembers].sort((a, b) =>
                  a.school.localeCompare(b.school)
                );
                let lastSchool = '';

                return sortedMembers.map(member => {
                  const schoolCount = selectedMembers.filter(
                    m => m.school === member.school
                  ).length;
                  const isFirstOfSchool = member.school !== lastSchool;
                  lastSchool = member.school;

                  return (
                    <div
                      key={member.id}
                      className={styles.tableBodyRow}
                      onClick={() => handleDeselectMember(member.id)}
                    >
                      <div className={styles.cellSchoolBody}>
                        {isFirstOfSchool ? (
                          <>
                            <span className={styles.cellSchoolText}>{member.school}</span>
                            <span className={styles.cellCountText}>({schoolCount}명)</span>
                          </>
                        ) : null}
                      </div>
                      <div className={styles.cellNameBody}>
                        <span className={styles.cellTextLeft}>{member.name}</span>
                      </div>
                      <div className={styles.cellGenerationBody}>
                        <span className={styles.cellTextLeft}>{member.generation}</span>
                      </div>
                      <div className={styles.cellPartBody}>
                        <span className={styles.cellTextLeft}>{member.part}</span>
                      </div>
                    </div>
                  );
                });
              })()}
              {/* 빈 행 채우기 */}
              {Array.from({ length: Math.max(0, 10 - selectedMembers.length) }).map((_, i) => (
                <div key={`empty-selected-${i}`} className={styles.tableBodyRowEmpty} />
              ))}
            </div>
          </div>
        </div>

        {/* 멤버 선택 테이블 */}
        <div className={styles.tableGroup}>
          <div className={styles.tableTitle}>
            <span className={styles.tableTitleText}>멤버 선택</span>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHeaderRight}>
              <div className={styles.cellNameRight}>
                <span className={styles.headerText}>이름</span>
              </div>
              <div className={styles.cellGenerationRight}>
                <span className={styles.headerText}>기수</span>
              </div>
              <div className={styles.cellPartRight}>
                <span className={styles.headerText}>파트</span>
              </div>
              <div className={styles.cellCheck}>
                <div className={styles.checkbox}>
                  <Image src="/check_white.svg" alt="" width={12} height={9} />
                </div>
              </div>
            </div>
            <div className={styles.tableBody}>
              {filteredMembers.map(member => {
                const isSelected = isMemberSelected(member.id);
                return (
                  <div
                    key={member.id}
                    className={styles.tableBodyRowRightOuter}
                    onClick={() => handleToggleMember(member)}
                  >
                    <div
                      className={`${styles.tableBodyRowRightInner} ${isSelected ? styles.tableBodyRowRightInnerSelected : ''}`}
                    >
                      <div className={styles.cellNameRightBody}>
                        <span className={styles.cellTextRight}>{member.name}</span>
                      </div>
                      <div className={styles.cellGenerationRightBody}>
                        <span className={styles.cellTextRight}>{member.generation}</span>
                      </div>
                      <div className={styles.cellPartRightBody}>
                        <span className={styles.cellTextRight}>{member.part}</span>
                      </div>
                      <div className={styles.cellCheck}>
                        <div
                          className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}
                        >
                          <Image src="/check_white.svg" alt="" width={12} height={9} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* 빈 행 채우기 */}
              {Array.from({ length: Math.max(0, 10 - filteredMembers.length) }).map((_, i) => (
                <div key={`empty-available-${i}`} className={styles.tableBodyRowRightOuter}>
                  <div className={styles.tableBodyRowRightInner} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantManagement;
