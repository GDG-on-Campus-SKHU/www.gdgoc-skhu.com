import dynamic from 'next/dynamic';

const IdeaCheck = dynamic(
  () => import('../features/team-building/components/IdeaCheck/IdeaCheck'),
  { ssr: false }
);

export default IdeaCheck;
