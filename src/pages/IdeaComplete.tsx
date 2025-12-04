import dynamic from 'next/dynamic';

const IdeaCompletePage = dynamic(
  () => import('../features/team-building/components/IdeaComplete/IdeaCompletePage'),
  { ssr: false }
);

export default IdeaCompletePage;
