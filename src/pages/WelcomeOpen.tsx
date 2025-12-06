import dynamic from 'next/dynamic';

const WelcomeOpenPage = dynamic(
  () => import('../features/team-building/pages/WelcomeOpen'),
  { ssr: false }
);

export default WelcomeOpenPage;
