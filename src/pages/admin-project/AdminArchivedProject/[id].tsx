import dynamic from 'next/dynamic';

const ArchivedProject = dynamic(
  () => import('../../../features/Admin/components/ArchivedProjectDetail/ArchivedProjectDetail'),
  { ssr: false }
);

export default ArchivedProject;
