import dynamic from 'next/dynamic';

const AdminActivityCategoryCreate = dynamic(
  () =>
    import('../features/Admin/components/AdminActivityCategoryCreate/AdminActivityCategoryCreate'),
  { ssr: false }
);

export default AdminActivityCategoryCreate;
