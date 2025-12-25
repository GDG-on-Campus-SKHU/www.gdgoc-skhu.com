import dynamic from 'next/dynamic';

const IdeaFormPage = dynamic(
  () => import('../features/team-building/components/IdeaForm/IdeaFormPage'),
  { ssr: false }
);

export default IdeaFormPage;
