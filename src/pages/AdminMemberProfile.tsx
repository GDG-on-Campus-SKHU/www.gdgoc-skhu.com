import dynamic from 'next/dynamic';

const AdminMemberProfile = dynamic(
  () => import('../features/Admin/components/AdminMemberProfile/AdminMemberProfile'),
  { ssr: false }
);

export default AdminMemberProfile;
