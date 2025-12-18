import type { NextPage } from 'next';
import styled from 'styled-components';

type DepartedMember = {
  name: string;
  school: string;
  part: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: string;
  departedAt: string;
};

const MOCK_DEPARTED_MEMBER: DepartedMember = {
  name: '이윤하',
  school: '성공회대학교',
  part: '웹',
  email: 'email@example.com',
  phone: '010-1234-5678',
  joinedAt: '2025년 12월 1일',
  status: '탈퇴',
  departedAt: '2025년 12월 1일',
};

const AdminDepartedMember: NextPage = () => {
  const member = MOCK_DEPARTED_MEMBER;

  return (
    <Container>
      <MainContent>
        <Header>
          <Title>멤버 관리</Title>
          <Subtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</Subtitle>
        </Header>

        <DetailHeader>
          <MemberName>{member.name}</MemberName>
        </DetailHeader>

        <ContentCard>
          <FormGrid>
            <FieldGroup>
              <FieldLabel>학교</FieldLabel>
              <MutedInput value={member.school} readOnly />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>파트</FieldLabel>
              <MutedInput value={member.part} readOnly />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>이메일</FieldLabel>
              <MutedInput value={member.email} readOnly />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>전화번호</FieldLabel>
              <MutedInput value={member.phone} readOnly />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>가입일</FieldLabel>
              <MutedInput value={member.joinedAt} readOnly />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>상태</FieldLabel>
              <MutedInput value={member.status} readOnly />
            </FieldGroup>
          </FormGrid>

          <SingleFieldRow>
            <FieldGroup>
              <FieldLabel>탈퇴일</FieldLabel>
              <MutedInput value={member.departedAt} readOnly />
            </FieldGroup>
          </SingleFieldRow>

          <SingleActionRow>
            <OutlineDangerButton type="button">소프트밴</OutlineDangerButton>
          </SingleActionRow>
        </ContentCard>
      </MainContent>
    </Container>
  );
};

export default AdminDepartedMember;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
  overflow: visible;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 45px 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  min-height: 100vh;
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
  gap: 40px;

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
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 40px;
  column-gap: 20px;
  box-sizing: border-box;
`;

const SingleFieldRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const FieldLabel = styled.label`
  color: #040405;
  font-size: 16px;
  font-weight: 700;
`;

const InputBase = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  border: 0px solid #d0d5dd;
  background: #fff;
  padding: 0 16px;
  font-size: 16px;
  color: #15171a;
  box-sizing: border-box;
`;

const MutedInput = styled(InputBase)`
  border-radius: 8px;
  background: var(--grayscale-100, #f9f9fa);
`;

const SingleActionRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 247px 0 40px;
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
