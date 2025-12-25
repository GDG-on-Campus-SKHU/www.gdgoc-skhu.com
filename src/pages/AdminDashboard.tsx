import dynamic from 'next/dynamic';

const AdminDashBoard = dynamic(
  () => import('../features/Admin/components/AdminDashboard/AdminDashboard'),
  { ssr: false }
);

export default AdminDashBoard;
