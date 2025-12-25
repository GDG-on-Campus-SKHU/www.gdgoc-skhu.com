import dynamic from 'next/dynamic';

const AdminActivityVideoEdit = dynamic(
  () => import('../features/Admin/components/AdminActivityVideoEdit/AdminActivityVideoEdit'),
  { ssr: false }
);

export default AdminActivityVideoEdit;
