import dynamic from 'next/dynamic';

const AdminDepartedMember = dynamic(
  () => import('../features/Admin/components/AdminDepartedMember/AdminDepartedMember'),
  { ssr: false }
);

export default AdminDepartedMember;
