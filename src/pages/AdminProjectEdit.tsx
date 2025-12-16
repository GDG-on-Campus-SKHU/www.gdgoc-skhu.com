import dynamic from 'next/dynamic';

const AdminProjectEdit = dynamic(
  () => import('../features/Admin/components/AdminProjectEdit/AdminProjectEdit'),
  { ssr: false }
);

export default AdminProjectEdit;
