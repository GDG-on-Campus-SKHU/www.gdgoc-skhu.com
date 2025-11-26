import dynamic from 'next/dynamic';

const IdeaApply = dynamic(
  () => import('../features/team-building/components/IdeaApply/IdeaApply'),
  { ssr: false }
);

export default IdeaApply;
