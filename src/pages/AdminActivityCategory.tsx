import dynamic from 'next/dynamic';

const AdminActivityCategory = dynamic(
  () => import('../features/Admin/components/AdminActivityCategory/AdminActivityCategoryEdit'),
  { ssr: false }
);

export default AdminActivityCategory;
