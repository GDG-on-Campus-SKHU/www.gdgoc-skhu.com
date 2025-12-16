import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import styled from 'styled-components';

import ReQuill from '../../../team-building/components/ReQuill';
import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';

type LinkItem = {
  id: number;
  type: string;
  value: string;
};

const SCHOOL_OPTIONS = ['성공회대학교', '한성대학교', '고려대학교'];
const PART_OPTIONS = ['PM', 'BE', 'FE', 'Design', 'AI/ML'];
const ROLE_OPTIONS = ['25-26 Member', '24-25 Core', '23-24 Member', 'Guest'];
const TECH_STACK_OPTIONS = [
  'React',
  'Next.js',
  'TypeScript',
  'Nest.js',
  'Spring',
  'Swift',
  'Kotlin',
  'Figma',
  'Illustrator',
  'Photoshop',
];
const LINK_TYPE_OPTIONS = ['GitHub', 'Behance', 'Notion', 'Portfolio', 'LinkedIn', '기타'];

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  },
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
];

const AdminMemberProfileEdit: NextPage = () => {
  const [school] = useState(SCHOOL_OPTIONS[0]);
  const [part] = useState(PART_OPTIONS[1]);
  const [roles] = useState<string[]>([ROLE_OPTIONS[0], ROLE_OPTIONS[1], ROLE_OPTIONS[2]]);
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([{ id: 1, type: 'GitHub', value: '' }]);
  const [introduction, setIntroduction] = useState('');

  const addLink = () => {
    const nextId = Math.max(0, ...links.map(link => link.id)) + 1;
    setLinks(prev => [...prev, { id: nextId, type: LINK_TYPE_OPTIONS[0], value: '' }]);
  };

  const handleLinkTypeChange = (id: number, selected: string[]) => {
    setLinks(prev =>
      prev.map(link => (link.id === id ? { ...link, type: selected[0] ?? link.type } : link))
    );
  };

  const handleLinkValueChange = (id: number, value: string) => {
    setLinks(prev => prev.map(link => (link.id === id ? { ...link, value } : link)));
  };

  const quillKey = useMemo(() => `member-edit-${roles.join('-')}-${part}`, [roles, part]);

  return (
    <Container>
      <Sidebar>
        <Logo>
          <GdgocSkhuImage src="/gdgoc_skhu_admin.svg" alt="GDGoC SKHU" width={40} height={26} />
          <LogoText>GDGoC SKHU</LogoText>
        </Logo>

        <LoginInfo>
          <UserName>윤준석</UserName>
          <Divider>님</Divider>
        </LoginInfo>

        <MenuList>
          <MenuItem>대시보드</MenuItem>
          <MenuItem>가입 심사</MenuItem>
          <MenuItemActive>
            <span>멤버 관리</span>
            <MenuArrowIcon src="/rightarrow_admin.svg" width={14} height={14} alt="" />
          </MenuItemActive>
          <MenuItem>프로젝트 관리</MenuItem>
          <MenuItem>아이디어 관리</MenuItem>
          <MenuItem>프로젝트 갤러리 관리</MenuItem>
          <MenuItem>액티비티 관리</MenuItem>
          <MenuItem>홈 화면으로 나가기</MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>멤버 관리</Title>
          <HeaderSubtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</HeaderSubtitle>
        </Header>

        <ContentWrapper>
          <MemberName>주현지</MemberName>

          <FormSection>
            <FieldRow>
              <FieldLabel>학교</FieldLabel>
              <FieldValue>{school}</FieldValue>
            </FieldRow>

            <FieldRoleRow>
              <FieldLabel>역할</FieldLabel>
              <RoleContent>
                <Chips>
                  {roles.map((role, index) => (
                    <Chip key={role} $active={index === 0}>
                      <ChipText>{role}</ChipText>
                    </Chip>
                  ))}
                </Chips>
                <RoleNote>* 역할이 바뀐 경우 운영진에게 문의하세요.</RoleNote>
              </RoleContent>
            </FieldRoleRow>

            <FieldRow>
              <FieldLabel>파트</FieldLabel>
              <FieldValue>{part}</FieldValue>
            </FieldRow>

            <VerticalField>
              <FieldLabel>기술스택</FieldLabel>
              <SelectBoxWrapper>
                <SelectBoxBasic
                  options={TECH_STACK_OPTIONS}
                  placeholder="보유하고 있는 기술 스택을 선택해주세요."
                  multiple
                  searchable
                  value={techStacks}
                  onChange={selected => setTechStacks(selected)}
                />
              </SelectBoxWrapper>
            </VerticalField>

            <VerticalLinkField>
              <FieldLabel>링크</FieldLabel>
              <LinksBlock>
                {links.map(link => (
                  <LinkRow key={link.id}>
                    <LinkSelectWrapper>
                      <SelectBoxBasic
                        options={LINK_TYPE_OPTIONS}
                        placeholder="타입 선택"
                        value={[link.type]}
                        onChange={selected => handleLinkTypeChange(link.id, selected)}
                      />
                    </LinkSelectWrapper>
                    <LinkInput
                      placeholder="PlaceHolder"
                      value={link.value}
                      onChange={e => handleLinkValueChange(link.id, e.target.value)}
                    />
                  </LinkRow>
                ))}
                <LinkAddButton type="button" onClick={addLink}>
                  <LinkAddButtonText>+</LinkAddButtonText>
                </LinkAddButton>
              </LinksBlock>
            </VerticalLinkField>

            <VerticalField>
              <FieldLabel>자기소개</FieldLabel>
              <QuillContainer>
                <ReQuill
                  key={quillKey}
                  value={introduction}
                  onChange={setIntroduction}
                  placeholder={`Github README 작성에 쓰이는 'markdown'을 이용해 작성해보세요.`}
                  modules={quillModules}
                  formats={quillFormats}
                  height={280}
                />
              </QuillContainer>
            </VerticalField>
          </FormSection>
        </ContentWrapper>

        <ActionRow>
          <SecondaryButton type="button">
            <SecondaryButtonText>미리보기</SecondaryButtonText>
          </SecondaryButton>
          <PrimaryButton type="button">
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

const Sidebar = styled.div`
  width: 255px;
  min-height: 100vh;
  background-color: #454b54;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Logo = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 28px 20px;
  gap: 12px;
  text-align: center;
  color: #fff;
  font-family: Pretendard;
`;

const GdgocSkhuImage = styled(Image)`
  width: 60px;
  max-height: 100%;
  object-fit: cover;
`;

const LogoText = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 400;
`;

const LoginInfo = styled.div`
  align-self: stretch;
  border-top: 1px solid #626873;
  display: flex;
  align-items: center;
  padding: 18px 28px 20px;
  gap: 8px;
  color: #fff;
  font-family: Pretendard;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 700;
`;

const Divider = styled.div`
  font-size: 16px;
  line-height: 160%;
  font-weight: 500;
`;

const MenuList = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  font-size: 16px;
  color: #fff;
  font-family: Pretendard;
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
  background: var(--primary-100, #d9e7fd);
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const ChipText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3-bold */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 28.8px */
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

const LinkSelectWrapper = styled.div`
  width: 220px;
  height: 50px;
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

const QuillContainer = styled.div`
  display: flex;
  width: 1080px;
  height: 400px;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;

  .ql-toolbar {
    width: 913px;
    height: 31px;
    flex-shrink: 0;
    border: none;
    border-bottom: 1px solid #e0e4ea;
    background: #fff;
    padding: 0;
    display: flex;
    align-items: center;

    .ql-formats {
      display: flex;
      align-items: center;
      margin-right: 8px;
      height: 100%;
    }

    button {
      width: 24px;
      height: 24px;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #f3f4f6;
        border-radius: 4px;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .ql-picker {
      height: 24px;

      .ql-picker-label {
        padding: 0 8px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #1f2024;
        border: none;

        &::before {
          line-height: 24px;
        }
      }
    }

    .ql-header .ql-picker-label::before {
      content: 'Normal';
    }

    .ql-header .ql-picker-item[data-value='1']::before {
      content: 'Heading 1';
    }

    .ql-header .ql-picker-item[data-value='2']::before {
      content: 'Heading 2';
    }
  }

  .ql-container {
    border: none;
    min-height: 260px;
    font-family: 'Pretendard', sans-serif;
  }

  .ql-editor {
    min-height: 260px;
    font-size: 14px;
    line-height: 1.6;
  }

  .ql-editor.ql-blank::before {
    color: #9ca3af;
    font-style: normal;
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

const LinkAddButtonText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
