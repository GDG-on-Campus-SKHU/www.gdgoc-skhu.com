import dynamic from 'next/dynamic';

const IdeaPreview = dynamic(
  () => import('../features/team-building/components/IdeaPreview/IdeaPreview'),
  { ssr: false }
);

export default IdeaPreview;
