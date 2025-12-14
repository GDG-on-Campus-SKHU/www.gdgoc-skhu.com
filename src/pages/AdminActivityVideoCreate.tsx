import dynamic from 'next/dynamic';

const AdminActivityVideoCreate = dynamic(
  () => import('../features/Admin/components/AdminActivityVideoCreate/AdminActivityVideoCreate'),
  { ssr: false }
);

export default AdminActivityVideoCreate;
