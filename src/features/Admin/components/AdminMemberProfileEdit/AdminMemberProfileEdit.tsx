/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { fetchUserProfile, updateUserProfile } from '@/lib/adminMember.api';
import { api } from '@/lib/api';
import {
  Generation,
  LinkType,
  TechStack,
  UpdateProfileData,
  UserLink,
  UserLinkOption,
  useTechStackOptions,
  useUserLinkOptions,
} from '@/lib/mypageProfile.api';
import { colors } from '@/styles/constants';
import { css } from '@emotion/react';
import MDEditor from '@uiw/react-md-editor';
import styled from 'styled-components';

import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';
import AdminMemberProfile, { resolveIconUrl } from '../AdminMemberProfile/AdminMemberProfile';

type MemberProfile = {
  userId: number;
  name: string;
  school: string;
  generations: Generation[];
  part: string;
  techStacks: TechStack[];
  userLinks: UserLink[];
  introduction: string;
};

const AdminMemberProfileEdit: NextPage = () => {
  const router = useRouter();
  const userIdParam = router.query.userId;
  const parsedUserId = typeof userIdParam === 'string' ? Number(userIdParam) : null;

  const [member, setMember] = useState<MemberProfile | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const { data: techStackOptions = [] } = useTechStackOptions();
  const { data: userLinkOptions = [] } = useUserLinkOptions();

  const GITHUB_FALLBACK_ICON = 'https://cdn.simpleicons.org/github';

  useEffect(() => {
    if (!parsedUserId) return;

    const fetchData = async () => {
      const member = await fetchUserProfile(parsedUserId);

      setMember({
        ...member,
        userLinks:
          member.userLinks.length > 0
            ? member.userLinks
            : [
                {
                  linkType: 'GITHUB',
                  url: '',
                },
              ],
      });
    };

    fetchData();
  }, [parsedUserId]);

  useEffect(() => {
    if (!member) return;

    if (member.userLinks.length === 0) {
      setMember(prev =>
        prev
          ? {
              ...prev,
              userLinks: [
                {
                  linkType: 'GITHUB',
                  url: '',
                },
              ],
            }
          : prev
      );
    }
  }, [member]);

  useEffect(() => {
    if (!member) return;
    if (member.userLinks.length > 0) return;
    if (userLinkOptions.length === 0) return;

    const githubOption = userLinkOptions.find(opt => opt.type === 'GITHUB');
    if (!githubOption) return;

    setMember(prev =>
      prev
        ? {
            ...prev,
            userLinks: [
              {
                linkType: githubOption.type,
                url: '',
              },
            ],
          }
        : prev
    );
  }, [member, userLinkOptions]);

  const sortedGenerations = useMemo(() => {
    if (!member) return [];
    return [...member.generations].sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1));
  }, [member]);

  if (!member) {
    return <div>로딩 중...</div>;
  }

  if (mode === 'preview') {
    return <AdminMemberProfile memberProps={member} onBack={() => setMode('edit')} />;
  }

  const validLinks = member.userLinks.filter(link => link.url.trim() !== '');
  const hasValidLinks = validLinks.length > 0;

  const handleImageError = (linkType: string) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(linkType);
      return next;
    });
  };

  const buildUpdateProfilePayload = (member: MemberProfile): UpdateProfileData => {
    return {
      techStacks: member.techStacks.map(stack => ({
        techStackType: stack.techStackType,
      })),

      userLinks: member.userLinks
        .filter(link => link.url.trim() !== '')
        .map(link => ({
          linkType: link.linkType,
          url: link.url,
        })),

      introduction: member.introduction,
    };
  };

  const handleSaveProfile = async () => {
    if (!parsedUserId || !member) return;

    try {
      const payload = buildUpdateProfilePayload(member);

      const updatedProfile = await updateUserProfile(parsedUserId, payload);

      setMember(updatedProfile);

      router.push(`/admin-member/${parsedUserId}/profile`);
    } catch (e) {
      console.error(e);
      alert('프로필 저장에 실패했습니다.');
    }
  };

  // ---------------------
  // 1. 드래그 앤 드롭 처리
  // ---------------------
  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (!imageFile) return;

    try {
      const url = await uploadImageToServer(imageFile);
      insertImageMarkdown(url);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
    }
  };

  // ---------------------
  // 2. 이미지 업로드 API
  // ---------------------
  async function uploadImageToServer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('imageFile', file);
    formData.append('directory', 'test'); // ← FormData에 함께 넣기

    const response = await api.post('/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url; // ← S3 URL 반환
  }

  // ---------------------
  // 3. 마크다운에 이미지 삽입
  // ---------------------
  function insertImageMarkdown(url: string) {
    const markdown = `\n![image](${url})\n`;

    setMember(prev =>
      prev
        ? {
            ...prev,
            introduction: (prev.introduction ?? '') + markdown,
          }
        : prev
    );
  }

  // ---------------------
  // 4. 붙여넣기 처리
  // ---------------------
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const url = await uploadImageToServer(file);
          insertImageMarkdown(url);
        } catch (err) {
          console.error('이미지 업로드 실패:', err);
        }
      }
    }
  };

  return (
    <Container>
      <MainContent>
        <Header>
          <Title>멤버 관리</Title>
          <HeaderSubtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</HeaderSubtitle>
        </Header>

        <ContentWrapper>
          <MemberName>{member.name}</MemberName>

          <FormSection>
            <FieldRow>
              <FieldLabel>학교</FieldLabel>
              <FieldValue>{member.school}</FieldValue>
            </FieldRow>

            <FieldRoleRow>
              <FieldLabel>역할</FieldLabel>
              <RoleContent>
                <Chips>
                  {sortedGenerations.map(gen => (
                    <Chip key={gen.id ?? `${gen.generation}-${gen.position}`} $active={gen.isMain}>
                      <ChipText $active={gen.isMain}>
                        {gen.generation} {gen.position}
                      </ChipText>
                    </Chip>
                  ))}
                </Chips>
                <RoleNote>* 역할이 바뀐 경우 운영진에게 문의하세요.</RoleNote>
              </RoleContent>
            </FieldRoleRow>

            <FieldRow>
              <FieldLabel>파트</FieldLabel>
              <FieldValue>{member.part}</FieldValue>
            </FieldRow>

            <VerticalField>
              <FieldLabel>기술스택</FieldLabel>
              <SelectBoxWrapper>
                <SelectBoxBasic
                  options={techStackOptions.map(opt => opt.displayName)}
                  placeholder="보유하고 있는 기술 스택을 선택해주세요."
                  multiple
                  searchable
                  value={member.techStacks.map(s => s.techStackType)}
                  onChange={selected =>
                    setMember(prev =>
                      prev
                        ? {
                            ...prev,
                            techStacks: selected.map(displayName => {
                              const option = techStackOptions.find(
                                o => o.displayName === displayName
                              );

                              return {
                                techStackType: option?.code ?? displayName,
                                iconUrl: option?.iconUrl ?? '',
                              };
                            }),
                          }
                        : prev
                    )
                  }
                />
              </SelectBoxWrapper>
              <TechStackList>
                {member.techStacks.map(stack => {
                  const option = techStackOptions.find(opt => opt.code === stack.techStackType);

                  if (!option) return null;

                  return (
                    <TechStackIcon key={stack.techStackType}>
                      <img
                        src={resolveIconUrl(option.iconUrl)}
                        alt={option.displayName}
                        width={36}
                        height={36}
                      />
                    </TechStackIcon>
                  );
                })}
              </TechStackList>
            </VerticalField>

            <VerticalLinkField>
              <FieldLabel>링크</FieldLabel>

              <LinksBlock>
                {member.userLinks.map((link, idx) => {
                  const option = userLinkOptions.find(opt => opt.type === link.linkType);

                  return (
                    <LinkRow key={`${link.linkType}-${idx}`}>
                      <SelectBoxBasic
                        options={userLinkOptions.map(opt => opt.name)}
                        placeholder="타입 선택"
                        value={[option?.name ?? link.linkType]}
                        onChange={selected => {
                          const option = userLinkOptions.find(o => o.name === selected[0]);

                          setMember(prev =>
                            prev
                              ? {
                                  ...prev,
                                  userLinks: prev.userLinks.map((l, i) =>
                                    i === idx
                                      ? {
                                          ...l,
                                          linkType: (option?.type ?? l.linkType) as LinkType,
                                        }
                                      : l
                                  ),
                                }
                              : prev
                          );
                        }}
                      />

                      <LinkInput
                        placeholder="링크를 입력해주세요."
                        value={link.url}
                        onChange={e =>
                          setMember(prev =>
                            prev
                              ? {
                                  ...prev,
                                  userLinks: prev.userLinks.map((l, i) =>
                                    i === idx ? { ...l, url: e.target.value } : l
                                  ),
                                }
                              : prev
                          )
                        }
                      />
                    </LinkRow>
                  );
                })}

                <LinkAddButton
                  type="button"
                  onClick={() =>
                    setMember(prev =>
                      prev
                        ? {
                            ...prev,
                            userLinks: [
                              ...prev.userLinks,
                              {
                                linkType: 'GITHUB' as LinkType,
                                url: '',
                              },
                            ],
                          }
                        : prev
                    )
                  }
                >
                  +
                </LinkAddButton>
              </LinksBlock>

              {hasValidLinks && (
                <div css={previewContainerCss}>
                  {validLinks.map(link => {
                    const linkOption = userLinkOptions.find(opt => opt.type === link.linkType);
                    const hasImageError = failedImages.has(link.linkType);

                    // options 로딩 전/후 상관없이 항상 GitHub 아이콘 보장
                    const rawIconUrl = hasImageError
                      ? GITHUB_FALLBACK_ICON
                      : (linkOption?.iconUrl ?? GITHUB_FALLBACK_ICON);

                    return (
                      <a
                        key={`${link.linkType}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={hasImageError ? linkIconWithBorderCss : linkIconSimpleCss}
                        title={linkOption?.name || 'GitHub'}
                      >
                        <img
                          src={resolveIconUrl(rawIconUrl)} // http(s)면 그대로 사용
                          alt={linkOption?.name || 'GitHub'}
                          onError={() => handleImageError(link.linkType)}
                        />
                      </a>
                    );
                  })}
                </div>
              )}
            </VerticalLinkField>

            <VerticalField>
              <FieldLabel>자기소개</FieldLabel>
              <div css={editorContainerCss} data-color-mode="light">
                <MDEditor
                  value={member?.introduction}
                  onChange={val =>
                    setMember(prev => (prev ? { ...prev, introduction: val || '' } : prev))
                  }
                  height={400}
                  preview="live"
                  hideToolbar={false}
                  visibleDragbar={true}
                  textareaProps={{
                    onDrop: handleDrop,
                    onPaste: handlePaste,
                    placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
                  }}
                />
              </div>
            </VerticalField>
          </FormSection>
        </ContentWrapper>

        <ActionRow>
          <SecondaryButton type="button" onClick={() => setMode('preview')}>
            <SecondaryButtonText>미리보기</SecondaryButtonText>
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleSaveProfile}>
            <PrimaryButtonText>저장하기</PrimaryButtonText>
          </PrimaryButton>
        </ActionRow>
      </MainContent>
    </Container>
  );
};

export default AdminMemberProfileEdit;

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
  width: 1440px;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 60px 40px 40px;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  width: 472px;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 60px;
  margin-top: 91px;
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

const HeaderSubtitle = styled.h3`
  margin: 0;
  align-self: stretch;
  font-size: 20px;
  line-height: 160%;
  font-weight: 500;
  color: #626873;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MemberName = styled.h2`
  color: var(--grayscale-1000, #040405);

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
`;

const FieldRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 60px;
`;

const VerticalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const FieldValue = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const RoleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Chips = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Chip = styled.span<{ $active?: boolean }>`
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? 'var(--primary-100, #d9e7fd)' : 'var(--gray-100, #f1f3f5)'};
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const ChipText = styled.span<{ $active?: boolean }>`
  color: ${({ $active }) =>
    $active ? 'var(--primary-600-main, #4285f4)' : 'var(--gray-500, #868e96)'};

  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const RoleNote = styled.span`
  color: var(--grayscale-600, #7e8590);

  /* body/b4/b4-bold */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 25.6px */
`;

const SelectBoxWrapper = styled.div`
  width: 1080px;
  height: 50px;
`;

const LinksBlock = styled.div`
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const LinkRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const LinkInput = styled.input`
  width: 840px;
  height: 50px;
  padding: 0 14px;

  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  font-size: 14px;
  color: #1f2024;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #4285f4;
    background: #fff;
  }
`;

const LinkAddButton = styled.button`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;

  &:hover {
    background: #f3f4f6;
  }
`;

const editorContainerCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;

  & .w-md-editor {
    border-radius: 8px;
    border: 1px solid #c3c6cb;
  }

  & .w-md-editor-toolbar {
    border-bottom: 1px solid #d0d7de;
  }

  & .w-md-editor-text-pre {
    font-family: 'Courier New', monospace;
  }
`;

const ActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin: 159px 232px 0 232px;
`;

const SecondaryButton = styled.button`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #f5f7fa;
  }
`;

const PrimaryButton = styled.button`
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #3367d6;
  }
`;

const SecondaryButtonText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const PrimaryButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const VerticalLinkField = styled.div`
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const FieldRoleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 60px;
`;

const TechStackList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const TechStackIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #f5f5f5;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const previewContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

const linkIconSimpleCss = css`
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const linkIconWithBorderCss = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  background-color: white;
  padding: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    border-color: ${colors.grayscale[600]};
  }
`;
