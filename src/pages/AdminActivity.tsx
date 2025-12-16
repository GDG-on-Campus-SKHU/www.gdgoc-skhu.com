import dynamic from 'next/dynamic';

const AdminActivity = dynamic(
  () => import('../features/Admin/components/AdminActivity/AdminActivity'),
  { ssr: false }
);

export default AdminActivity;
