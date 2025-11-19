import dynamic from 'next/dynamic';

// Lazy load로 IdeaPage를 불러와도 되고, 일반 import도 가능
const IdeaPage = dynamic(() => import('./IdeaPage'), {
  ssr: false, // 클라이언트 전용 로직(localStorage 등)이라면 SSR 비활성화
});

export default function IdeaIndex() {
  return <IdeaPage />;
}
