import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getModifiableProject, getSchools } from 'src/lib/adminProject.api';

import styles from '../../styles/ParticipantManagement.module.css';
import { fetchSearchedUser } from '@/lib/adminMember.api';

type LocalMember = {
  id: number;
  school: string;
  name: string;
  generation: string;
  part: string;
};

const GENERATIONS = ['25-26', '24-25', '23-24'];

type ParticipantManagementProps = {
  projectId: number;
  participantUserIds: number[];
  onChangeParticipantUserIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const ParticipantManagement = ({
  projectId,
  participantUserIds,
  onChangeParticipantUserIds,
}: ParticipantManagementProps) => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 필터 상태
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);

  // 멤버 데이터
  const [allMembers, setAllMembers] = useState<LocalMember[]>([]);
  const [memberMap, setMemberMap] = useState<Map<number, LocalMember>>(new Map());
  const [selectedMembers, setSelectedMembers] = useState<LocalMember[]>([]);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 1️⃣ 필터 조건이 있는 경우만 검색
        if (selectedGeneration && selectedSchools.length > 0) {
          const users = await fetchSearchedUser({
            schools: selectedSchools,
            generation: selectedGeneration,
          });

          const mappedMembers: LocalMember[] = users.map(u => ({
            id: u.id,
            school: u.school.trim(),
            name: u.name.trim(),
            generation: u.generation.trim(),
            part: u.part.trim(),
          }));

          // 👉 멤버 선택 테이블용
          setAllMembers(mappedMembers);

          // 👉 선택된 멤버 보존용 캐시
          setMemberMap(prev => {
            const next = new Map(prev);
            mappedMembers.forEach(m => {
              if (!next.has(m.id)) {
                next.set(m.id, m);
              }
            });
            return next;
          });
        } else {
          // 2️⃣ 필터 없으면 검색 결과만 비움 (선택된 멤버는 유지)
          setAllMembers([]);
        }
      } catch (error) {
        console.error('검색 유저 조회 실패:', error);
        setAllMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, selectedGeneration, selectedSchools]);

  useEffect(() => {
    const fetchInitialParticipants = async () => {
      try {
        const project = await getModifiableProject();

        const mapped: LocalMember[] = project.participants.map(p => ({
          id: p.userId, // 🔥 핵심
          school: p.school,
          name: p.name,
          generation: p.generation,
          part: p.part,
        }));

        setSelectedMembers(mapped);

        // participantUserIds 동기화
        onChangeParticipantUserIds(mapped.map(m => m.id));
      } catch (e) {
        console.error('참여자 조회 실패', e);
      }
    };

    fetchInitialParticipants();
  }, [projectId]);


  useEffect(() => {
    const fetchInitialSelectedMembers = async () => {
      if (participantUserIds.length === 0) return;

      try {
        // 필터 없이 전체 조회 (가능하다는 전제)
        const users = await fetchSearchedUser({ generation: undefined, schools: undefined });

        setMemberMap(prev => {
          const next = new Map(prev);
          users.forEach(u => {
            if (participantUserIds.includes(u.id)) {
              next.set(u.id, {
                id: u.id,
                school: u.school.trim(),
                name: u.name.trim(),
                generation: u.generation?.trim(),
                part: u.part.trim(),
              });
            }
          });
          return next;
        });
      } catch (e) {
        console.error('초기 선택 멤버 조회 실패', e);
      }
    };

    fetchInitialSelectedMembers();
    // ✅ participantUserIds가 처음 세팅될 때 한 번 채우고 싶으면 아래처럼 가드도 가능
  }, [participantUserIds]);

  // const selectedMembers = Array.from(memberMap.values()).filter(m =>
  //   participantUserIds.includes(m.id)
  // );

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolData = await getSchools();
        setSchools(schoolData.map(s => s.school));
      } catch (e) {
        console.error('학교 목록 조회 실패', e);
      }
    };

    fetchSchools();
  }, []);

  const normalize = (v: string) => (v ?? '').trim();

  const filterByCondition = (members: LocalMember[]) => {
    // 🔥 기수 필수
    if (!selectedGeneration || selectedGeneration === '전체') return [];

    // 🔥 학교 최소 1개 필수
    if (selectedSchools.length === 0) return [];

    return members.filter(member => {
      const gen = normalize(member.generation);
      const sch = normalize(member.school);

      const matchGeneration = gen === normalize(selectedGeneration);

      const matchSchool = selectedSchools.some(selected => normalize(selected) === sch);

      return matchGeneration && matchSchool;
    });
  };

  const filteredAllMembers = filterByCondition(allMembers);

  const allFilteredSelected =
    filteredAllMembers.length > 0 &&
    filteredAllMembers.every(m => participantUserIds.includes(m.id));

  const handleToggleAllFilteredMembers = () => {
    const filteredIds = filteredAllMembers.map(m => m.id);

    onChangeParticipantUserIds(prev => {
      const isAllSelected = filteredIds.every(id => prev.includes(id));

      // 이미 전부 선택 → 전체 해제
      if (isAllSelected) {
        return prev.filter(id => !filteredIds.includes(id));
      }

      // 일부/전혀 선택 안 됨 → 전체 선택
      return Array.from(new Set([...prev, ...filteredIds]));
    });
  };

  const getSchoolDisplayLabel = () => {
    if (selectedSchools.length === 0) {
      return '학교 선택';
    }

    if (selectedSchools.length === 1) {
      return selectedSchools[0];
    }

    return `${selectedSchools[0]} 외 ${selectedSchools.length - 1}개`;
  };

  const handleToggleSchool = (school: string) => {
    if (school === '전체') {
      setSelectedSchools([]);
      return;
    }

    setSelectedSchools(prev =>
      prev.includes(school) ? prev.filter(s => s !== school) : [...prev, school]
    );
  };

  const handleToggleMember = (member: LocalMember) => {
    onChangeParticipantUserIds(prev => {
      const exists = prev.includes(member.id);

      if (exists) {
        setSelectedMembers(m => m.filter(x => x.id !== member.id));
        return prev.filter(id => id !== member.id);
      }

      setSelectedMembers(m => [...m, member]);
      return [...prev, member.id];
    });
  };

  const isMemberSelected = (memberId: number) => {
    return participantUserIds.includes(memberId);
  };

  const handleDeselectMember = (memberId: number) => {
    onChangeParticipantUserIds(prev => prev.filter(id => id !== memberId));
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
                {selectedGeneration || '기수 선택'}
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
              <span
                className={
                  selectedSchools.length === 0 ? styles.selectPlaceholder : styles.selectValue
                }
              >
                {getSchoolDisplayLabel()}
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
                {schools.map(school => (
                  <div
                    key={school}
                    className={`${styles.selectOption} ${
                      selectedSchools.includes(school) ? styles.optionSelected : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleSchool(school);
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
            <span className={styles.tableTitleCount}>{participantUserIds.length}명</span>
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
                        {isFirstOfSchool && (
                          <>
                            <span className={styles.cellSchoolText}>{member.school}</span>
                            <span className={styles.cellCountText}>({schoolCount}명)</span>
                          </>
                        )}
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

              {/* 빈 행 */}
              {Array.from({
                length: Math.max(0, 10 - selectedMembers.length),
              }).map((_, i) => (
                <div key={i} className={styles.tableBodyRowEmpty} />
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
              <div
                className={styles.cellCheck}
                onClick={e => {
                  e.stopPropagation();
                  handleToggleAllFilteredMembers();
                }}
              >
                <div
                  className={`${styles.checkbox} ${
                    allFilteredSelected ? styles.checkboxSelected : ''
                  }`}
                >
                  <Image src="/check_white.svg" alt="" width={12} height={9} />
                </div>
              </div>
            </div>

            <div className={styles.tableBody}>
              {filteredAllMembers.map(member => {
                const isSelected = isMemberSelected(member.id);

                return (
                  <div
                    key={member.id}
                    className={styles.tableBodyRowRightOuter}
                    onClick={() => handleToggleMember(member)}
                  >
                    <div
                      className={`${styles.tableBodyRowRightInner} ${
                        isSelected ? styles.tableBodyRowRightInnerSelected : ''
                      }`}
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
                          className={`${styles.checkbox} ${
                            isSelected ? styles.checkboxSelected : ''
                          }`}
                        >
                          <Image src="/check_white.svg" alt="" width={12} height={9} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 빈 행 */}
              {Array.from({
                length: Math.max(0, 10 - filteredAllMembers.length),
              }).map((_, i) => (
                <div key={i} className={styles.tableBodyRowRightOuter}>
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
