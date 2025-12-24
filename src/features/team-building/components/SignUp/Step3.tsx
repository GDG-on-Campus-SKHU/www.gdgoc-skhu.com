/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import { headerCss, step1Desc, titleCss } from '../../../../styles/GlobalStyle/AuthStyle';
import Button from '../Button';
import FieldOfSignUp from '../FieldOfSignUp';
import Modal from '../Modal';
import SelectBoxBasic from '../SelectBoxBasic';

// 닫기 아이콘
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 6L6 18"
      stroke="#1F2024"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#1F2024"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type PositionType = 'MEMBER' | 'CORE' | 'ORGANIZER';

interface Step3Props {
  orgType: 'internal' | 'external' | '';
  school: string;
  cohort: string;
  part: string;
  role: PositionType;
  agree: boolean;
  setSchool: (v: string) => void;
  setCohort: (v: string) => void;
  setPart: (v: string) => void;
  setRole: (v: PositionType) => void;
  setAgree: (v: boolean) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Step3({
  orgType,
  school,
  cohort,
  part,
  role,
  agree,
  setSchool,
  setCohort,
  setPart,
  setRole,
  setAgree,
  onPrev,
  onSubmit,
}: Step3Props) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (orgType === 'internal') setSchool('성공회대학교');
    if (!cohort) setCohort('25-26');
    if (!part) setPart('BACKEND');
    if (!role) setRole('MEMBER');
  }, [orgType, cohort, part, role, setSchool, setCohort, setPart, setRole]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (orgType !== 'internal') {
      if (!school.trim()) {
        newErrors.school = '학교명을 입력해주세요.';
      } else if (!school.includes('대학교')) {
        newErrors.school = "학교명에 '대학교'가 포함되어야 합니다.";
      }
    }

    if (!cohort) newErrors.cohort = '기수를 선택해주세요.';
    if (!part) newErrors.part = '파트를 선택해주세요.';
    if (!role) newErrors.role = '분류를 선택해주세요.';

    setLocalErrors(newErrors);
  }, [school, cohort, part, role, orgType]);

  const isDisabled = Object.keys(localErrors).length > 0 || !agree;

  // 약관 전문 JSX
  const termsContentNode = (
    <div css={termsWrapper}>
      <h3>제1조 (목적)</h3>
      <p>
        이 약관은 GDGoC SKHU(이하 "회사"라 함)이 제공하는 서비스의 이용과 관련하여 회사와 이용자
        간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>

      <h3>제2조 (정의)</h3>
      <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
      <ol>
        <li>"서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
        <li>
          "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
        </li>
        <li>
          "회원"이란 회사에 개인정보를 제공하여 회원가입을 한 자로서, 회사의 정보를 지속적으로
          제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
        </li>
        <li>"비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
        <li>
          "콘텐츠"란 회사 또는 이용자가 서비스 상에 게시한 모든 글, 사진, 동영상, 첨부파일, 링크
          등을 말합니다.
        </li>
      </ol>

      <h3>제3조 (약관 외 준칙)</h3>
      <p>
        이 약관에서 정하지 아니한 사항은 전기통신사업법, 전자상거래 등에서의 소비자보호에 관한 법률,
        개인정보 보호법 등 관련 법령의 규정과 일반적인 상관례에 의합니다.
      </p>

      <h3>제4조 (약관의 효력과 변경)</h3>
      <ol>
        <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
        <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
        <li>
          회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 기타 합리적인 방법으로
          사전에 공지합니다.
        </li>
        <li>
          이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수
          있습니다. 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에
          동의한 것으로 간주됩니다.
        </li>
      </ol>

      <h3>제5조 (이용계약의 체결)</h3>
      <ol>
        <li>
          이용계약은 이용자가 이 약관에 동의하고 회사가 정한 가입 양식에 따라 회원정보를 기입한 후
          가입을 신청하고, 회사가 이를 승낙함으로써 체결됩니다.
        </li>
        <li>
          회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 하지 않거나 사후에 이용계약을 탈퇴
          처리 할 수 있습니다.
          <ul>
            <li>가입 조건 확인</li>
            <li>기타 회사가 정한 이용신청 요건이 충족되지 않았을 경우</li>
          </ul>
        </li>
      </ol>

      <h3>제6조 (회원정보의 변경)</h3>
      <ol>
        <li>
          회원은 개인정보 관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
        </li>
        <li>
          회원은 회원가입 시 기재한 사항이 변경되었을 경우 전자우편 또는 기타 방법으로 회사에 그
          변경사항을 알려야 합니다.
        </li>
        <li>
          제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임을 지지 않습니다.
        </li>
      </ol>

      <h3>제7조 (개인정보보호 의무)</h3>
      <p>
        회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의
        보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
      </p>

      <h3>제8조 (회원의 아이디 및 비밀번호의 관리에 대한 의무)</h3>
      <ol>
        <li>
          회원의 아이디와 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가 이용하도록
          하여서는 안 됩니다.
        </li>
        <li>
          회사는 회원의 아이디가 개인정보 유출 우려가 있거나, 반사회적 또는 미풍양속에 어긋나거나
          회사 및 회사의 운영자로 오인할 우려가 있는 경우, 해당 아이디의 이용을 제한할 수 있습니다.
        </li>
        <li>
          회원은 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시
          회사에 통지하고 회사의 안내에 따라야 합니다.
        </li>
        <li>
          제3항의 경우에 해당 회원이 회사에 그 사실을 통지하지 않거나, 통지한 경우에도 회사의 안내에
          따르지 않아 발생한 불이익에 대하여 회사는 책임을 지지 않습니다.
        </li>
      </ol>

      <h3>제9조 (이용자의 의무)</h3>
      <ol>
        <li>
          이용자는 다음 행위를 하여서는 안 됩니다.
          <ul>
            <li>신청 또는 변경 시 허위 내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
            <li>회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해</li>
            <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>
              외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개
              또는 게시하는 행위
            </li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ul>
        </li>
        <li>
          이용자는 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가
          통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
        </li>
        <li>
          이용자가 이를 위반하거나 허위 또는 부정확한 정보를 기재한 경우, 회사는 사전 통지 없이 해당
          정보의 전부 또는 일부를 삭제·수정할 수 있으며, 서비스 이용을 제한하거나 회원 자격을
          상실시킬 수 있습니다.
        </li>
      </ol>

      <h3>제10조 (서비스의 제공 및 변경)</h3>
      <ol>
        <li>
          회사는 다음과 같은 서비스를 제공합니다.
          <p className="sub-title">1. 회원 가입 및 계정 정보</p>
          <ul>
            <li>
              회원 가입 시 이름, 이메일 주소, 전화번호, 소속 대학교 등 기본 정보가 수집됩니다.
            </li>
            <li>이메일 주소는 로그인 및 본인 인증 목적으로만 사용됩니다.</li>
            <li>
              전화번호는 동명이인 구분 등 내부 식별 목적으로만 사용되며, 외부에 공개되지 않습니다.
            </li>
          </ul>
          <p className="sub-title">2. 프로필 작성 및 정보 공개</p>
          <ul>
            <li>회원은 가입 후 프로젝트에 참여할 경우 프로필을 작성할 수 있습니다.</li>
            <li>사용자가 직접 작성한 프로필 정보는 다른 회원들이 조회 가능합니다.</li>
            <li>프로필에 기재되는 내용은 사용자의 선택에 따라 입력되며, 공개를 전제로 합니다.</li>
          </ul>
          <p className="sub-title">3. 프로젝트 참여 기록 및 정보 보존</p>
          <ul>
            <li>
              회원이 프로젝트에 팀장 또는 팀원으로 참여한 경우, 이름, 소속 학교, 기수 정보가
              프로젝트 갤러리에 기록됩니다.
            </li>
            <li>해당 프로젝트 참여 기록은 회원 탈퇴 이후에도 삭제되지 않습니다.</li>
            <li>이는 프로젝트 이력의 신뢰성과 기록 보존을 위한 목적입니다.</li>
          </ul>
          <p className="sub-title">4. 회원 탈퇴 시 정보 처리</p>
          <ul>
            <li>
              회원 탈퇴 시 가입일, 탈퇴일을 제외한 기본 회원 정보와 작성한 프로필 정보는 삭제됩니다.
            </li>
            <li>
              단, 프로젝트 참여 기록 내에 남아 있는 이름 등 식별 정보는 삭제되지 않으며, 탈퇴
              이후에도 프로젝트 기록의 일부로 유지됩니다.
            </li>
          </ul>
          <p className="sub-title">5. 아이디어 등록 및 열람 범위</p>
          <ul>
            <li>
              회원이 아이디어를 등록할 경우, 동일 프로젝트에 참여 중인 모든 회원이 해당 아이디어를
              조회할 수 있습니다.
            </li>
            <li>타인의 아이디어를 무단 복제, 저장, 도용하는 행위는 금지됩니다.</li>
            <li>
              프로젝트 팀빌딩 완료 이후에는, 관리자를 제외한 일반 회원은 아이디어를 조회할 수
              없습니다.
            </li>
          </ul>
          <p className="sub-title">6. 이용 제한 및 책임</p>
          <ul>
            <li>
              회원은 본 서비스를 통해 열람한 아이디어 및 콘텐츠를 개인적·비상업적 목적 범위 내에서만
              이용해야 합니다.
            </li>
            <li>
              아이디어 도용, 무단 활용 등 약관 위반 행위가 확인될 경우 서비스 이용 제한 등 조치가
              이루어질 수 있습니다.
            </li>
          </ul>
        </li>
        <li>
          회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를
          변경할 수 있습니다.
        </li>
        <li>
          회사는 이용자에게 서비스를 제공함에 있어 관련 법령, 약관, 운영정책 및 공지사항 등에서 정한
          바에 따라 무료로 서비스를 제공합니다.
        </li>
      </ol>

      <h3>제11조 (서비스의 중단)</h3>
      <ol>
        <li>
          회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한
          경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
        </li>
        <li>
          회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가
          입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는
          그러하지 아니합니다.
        </li>
        <li>
          사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는
          경우에는 회사는 제4조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라
          소비자에게 보상합니다.
        </li>
      </ol>

      <h3>제12조 (회원탈퇴 및 자격 상실 등)</h3>
      <ol>
        <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</li>
        <li>
          회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
          <ul>
            <li>가입 신청 시에 허위 내용을 등록한 경우</li>
            <li>
              다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는
              경우
            </li>
            <li>
              서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
            </li>
          </ul>
        </li>
        <li>
          회사가 회원 자격을 제한·정지시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그
          사유가 시정되지 아니하는 경우 회사는 회원자격을 상실시킬 수 있습니다.
        </li>
        <li>
          회사가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를
          통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
        </li>
      </ol>

      <h3>제13조 (정보의 제공 및 광고의 게재)</h3>
      <p>
        회사는 회원에게 서비스 이용에 필요한 정보를 공지사항이나 전자우편 등의 방법으로 제공할 수
        있습니다. 다만, 회사는 회원이 동의하지 않는 한 영리목적의 광고성 정보를 제공하지 않습니다.
      </p>

      <h3>제14조 (서비스 이용시간)</h3>
      <ol>
        <li>
          서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을
          원칙으로 합니다.
        </li>
        <li>
          회사는 일부 서비스를 일정범위로 분할하여 각 범위별로 이용가능 시간을 별도로 정할 수
          있습니다. 이 경우 그 내용을 사전에 공지합니다.
        </li>
      </ol>

      <h3>제15조 (서비스 이용 제한)</h3>
      <ol>
        <li>
          회사는 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가 발생하거나 발생할 우려가 있는
          경우와 전기통신사업법에 의한 기간통신사업자가 전기통신 서비스를 중지하는 등 기타
          불가항력적 사유가 있는 경우에는 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.
        </li>
        <li>
          회사는 제1항에 의한 서비스 중단의 경우에는 상당한 기간 내에 그 사유를 공지하고, 사전에
          공지할 수 없는 부득이한 사유가 있는 경우에는 사후에 공지합니다.
        </li>
      </ol>

      <h3>제16조 (게시물의 관리)</h3>
      <ol>
        <li>
          회원의 게시물이 관련 법령, 본 약관에 위반되거나 타인의 권리를 침해한다고 판단되는 경우,
          회사는 관련 법령에 따라 해당 게시물에 대한 접근을 임시적으로 차단하거나 삭제할 수
          있습니다.
        </li>
        <li>
          회사가 제1항에 따라 회원의 게시물을 삭제하거나 게시 중단 조치를 취하는 경우, 회사는 해당
          조치의 사유를 회원에게 통지합니다. 다만, 긴급한 경우에는 사후에 통지할 수 있습니다.
        </li>
      </ol>

      <h3>제17조 (게시물의 저작권)</h3>
      <ol>
        <li>회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</li>
        <li>
          회원이 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션 등에 노출될 수
          있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수
          있습니다.
        </li>
        <li>회사는 회원의 명시적인 동의 없이 회원의 게시물을 상업적으로 이용하지 않습니다.</li>
        <li>
          회원은 언제든지 서비스 내 관리기능을 통해 자신의 게시물에 대해 삭제, 수정, 비공개 등의
          조치를 취할 수 있습니다.
        </li>
      </ol>

      <h3>제18조 (책임제한)</h3>
      <ol>
        <li>
          회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
          서비스 제공에 관한 책임이 면제됩니다.
        </li>
        <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
        <li>
          회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그
          밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
        </li>
        <li>
          회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 관하여는 책임을 지지
          않습니다.
        </li>
        <li>
          회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는
          책임이 면제됩니다.
        </li>
      </ol>

      <h3>제19조 (준거법 및 재판관할)</h3>
      <ol>
        <li>회사와 회원 간 제기된 소송은 대한민국법을 준거법으로 합니다.</li>
        <li>회사와 회원 간 발생한 분쟁에 관한 소송은 회사 소재지 관할법원의 관할로 합니다.</li>
      </ol>

      <h3>제20조 (기타)</h3>
      <ol>
        <li>이 약관에 명시되지 않은 사항은 관련 법령의 규정에 따릅니다.</li>
        <li>
          회사는 필요한 경우 특정 서비스에 관하여 별도의 이용약관 및 정책을 둘 수 있으며, 해당
          내용이 이 약관과 상충할 경우에는 별도의 이용약관 및 정책이 우선하여 적용됩니다.
        </li>
      </ol>

      <h3>부칙</h3>
      <p>이 약관은 2025-12-14부터 시행합니다.</p>
    </div>
  );

  return (
    <section css={sectionCss}>
      <header css={headerCss}>
        <h2 css={[typography.h2Bold, titleCss]}>회원가입</h2>
        <span css={stepCountCss}>2/2</span>
      </header>

      <p css={[typography.b4, step1Desc]}>동아리 정보를 입력해주세요.</p>

      <form css={formBox} onSubmit={onSubmit}>
        <div css={formGroup}>
          <label css={labelCss}>학교</label>
          <FieldOfSignUp
            placeholder={orgType === 'internal' ? '성공회대학교' : '예: 성신여자대학교'}
            value={school}
            onChange={e => setSchool(e.target.value)}
            disabled={orgType === 'internal'}
            error={!!localErrors.school}
            errorMessage={localErrors.school}
          />
        </div>

        <div css={gridRow}>
          <div css={formGroup}>
            <label css={labelCss}>기수</label>
            <SelectBoxBasic
              options={['25-26', '24-25', '23-24', '22-23']}
              value={[cohort]}
              onChange={([value]) => setCohort(value)}
            />
            {!!localErrors.cohort && <p css={errorText}>{localErrors.cohort}</p>}
          </div>

          <div css={formGroup}>
            <label css={labelCss}>파트</label>
            <SelectBoxBasic
              options={['PM', 'DESIGN', 'WEB', 'MOBILE', 'BACKEND', 'AI']}
              value={[part]}
              onChange={([value]) => setPart(value)}
            />
            {!!localErrors.part && <p css={errorText}>{localErrors.part}</p>}
          </div>
        </div>

        <div css={formGroup}>
          <label css={labelCss}>분류</label>
          <div css={radioGroup}>
            {(['MEMBER', 'CORE', 'ORGANIZER'] as PositionType[]).map(r => (
              <label key={r} css={radioLabel}>
                <input
                  type="radio"
                  checked={role === r}
                  onChange={() => setRole(r)}
                  css={radioInput(role === r)}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
          {!!localErrors.role && <p css={errorText}>{localErrors.role}</p>}
        </div>

        <div css={formGroup}>
          <div css={agreeRow}>
            <div css={agreeCheck(agree)} onClick={() => setAgree(!agree)}>
              {agree && '✓'}
            </div>
            <button type="button" css={agreeBtn} onClick={() => setShowTermsModal(true)}>
              이용 약관 및 개인정보 처리 방침
            </button>
          </div>
        </div>

        <div css={buttonBox}>
          <div css={leftBtn}>
            <Button variant="secondary" title="이전" onClick={onPrev} />
          </div>

          <div css={rightBtn}>
            <Button type="submit" title="완료" disabled={isDisabled} />
          </div>
        </div>
      </form>

      {/* 약관 모달: Wrapper div에 스타일을 적용하여 TS 에러 회피 및 스타일 적용 */}
      {showTermsModal && (
        <div css={modalCustomStyle}>
          <Modal
            type="scroll"
            title={
              (
                <div css={modalHeaderCss}>
                  <span>GDGoC SKHU 서비스 이용약관</span>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(false)}
                    css={closeButtonCss}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) as unknown as string
            }
            message={termsContentNode}
            buttonText="" // 빈 문자열 전달 (CSS로 숨김)
            onClose={() => setShowTermsModal(false)}
            customTitleAlign="left"
          />
        </div>
      )}
    </section>
  );
}

// --- Styles ---

const modalCustomStyle = css`
  & > div {
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    padding-top: 15vh;
  }

  & > div > div {
    width: 33vw;
    height: 78vh;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }

  & > div > div > button {
    display: none;
    height: 0;
    padding: 0;
    margin: 0;
  }

  & > div > div > h2 + div {
    flex: 1;
    min-height: 0;
    max-height: none !important;
    margin-bottom: 0 !important;
    overflow-y: auto;
  }
`;

const modalHeaderCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const closeButtonCss = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.7;
  }
`;

const termsWrapper = css`
  margin-bottom: 16px;
  text-align: left;
  color: ${colors.grayscale[700]};
  font-size: 14px;
  line-height: 1.6;
  padding: 0 4px;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${colors.black};
    margin-top: 24px;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 8px;
    word-break: keep-all;
  }

  ol {
    margin-bottom: 8px;
    padding-left: 20px;
    list-style-type: decimal;
    li {
      margin-bottom: 4px;
      padding-left: 4px;
    }
  }

  ul {
    margin-top: 4px;
    margin-bottom: 8px;
    padding-left: 20px;
    list-style-type: disc;
    li {
      margin-bottom: 4px;
    }
  }

  .sub-title {
    font-weight: 600;
    margin-top: 12px;
    color: ${colors.grayscale[900]};
  }
`;

const sectionCss = css`
  width: 420px;
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
  padding: 36px 36px 48px;
  margin-top: 120px;
  margin-bottom: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const stepCountCss = css`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.grayscale[600]};
`;

const formBox = css`
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 8px;
`;

const formGroup = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const labelCss = css`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.black};
`;

const gridRow = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const radioGroup = css`
  display: flex;
  gap: 18px;
  margin-top: 4px;
  margin-bottom: 6px;
`;

const radioLabel = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.black};
`;

const radioInput = (checked: boolean) => css`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: inset 0 0 0
    ${checked ? `6px ${colors.primary[600]}` : `1.5px ${colors.grayscale[400]}`};
  cursor: pointer;
`;

const agreeRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  margin-bottom: 22px;
`;

const agreeCheck = (checked: boolean) => css`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: ${checked ? colors.primary[600] : colors.grayscale[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-size: 13px;
  cursor: pointer;
`;

const agreeBtn = css`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.black};
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;

const errorText = css`
  color: ${colors.point.red};
  font-size: 13px;
  margin-top: 6px;
`;

const buttonBox = css`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const leftBtn = css`
  flex: 1;
`;

const rightBtn = css`
  flex: 2;
`;
