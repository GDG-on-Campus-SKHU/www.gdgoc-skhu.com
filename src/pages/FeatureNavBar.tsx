import dynamic from 'next/dynamic';

const FeatureNavBarComponent = dynamic(
  () => import('../features/team-building/components/FeatureNavBar/FeatureNavBar'),
  { ssr: false }
);

export default FeatureNavBarComponent;
