import dynamic from 'next/dynamic';

const IdeaListDetail = dynamic(
  () => import('../features/team-building/components/IdeaListDetail/IdeaListDetail'),
  { ssr: false }
);

export default IdeaListDetail;
