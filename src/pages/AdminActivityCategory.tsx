import dynamic from 'next/dynamic';

const AdminActivityCategory = dynamic(
  () => import('../features/Admin/components/AdminActivityCategory/AdminActivityCategory'),
  { ssr: false }
);

export default AdminActivityCategory;
