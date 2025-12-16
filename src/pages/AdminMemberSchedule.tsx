import dynamic from 'next/dynamic';

const AdminMemberSchedule = dynamic(
  () => import('../features/Admin/components/AdminMemberSchedule/AdminMemberSchedule'),
  { ssr: false }
);

export default AdminMemberSchedule;
