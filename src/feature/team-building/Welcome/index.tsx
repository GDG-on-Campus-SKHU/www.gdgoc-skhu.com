import dynamic from 'next/dynamic';

// welcome 페이지 전용 컴포넌트 (feature 폴더에 따로 존재한다고 가정)
const WelcomePage = dynamic(() => import('./Welcome'), {
  ssr: false, // 클라이언트 전용 로직이 있다면 false 유지
});

export default function WelcomeIndex() {
  return <WelcomePage />;
}
