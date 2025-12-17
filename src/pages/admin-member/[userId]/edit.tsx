import dynamic from 'next/dynamic';

const AdminMemberProfileEdit = dynamic(
  () => import('../../../features/Admin/components/AdminMemberProfileEdit/AdminMemberProfileEdit'),
  { ssr: false }
);

export default AdminMemberProfileEdit;
