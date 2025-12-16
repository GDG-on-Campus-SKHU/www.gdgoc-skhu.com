import dynamic from 'next/dynamic';

const AdminMemberDetail = dynamic(
  () => import('../features/Admin/components/AdminMemberDetail/AdminMemberDetail'),
  { ssr: false }
);

export default AdminMemberDetail;
