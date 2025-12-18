import dynamic from 'next/dynamic';

const ArchivedProject = dynamic(
  () => import('../../../features/Admin/components/ArchivedProject/ArchivedProject'),
  { ssr: false }
);

export default ArchivedProject;
