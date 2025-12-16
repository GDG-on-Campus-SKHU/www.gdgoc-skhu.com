import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminIdeaDeleted = dynamic(
  () => import('../features/Admin/components/AdminIdeaDeleted/AdminIdeaDeleted'),
  { ssr: false }
);

export default function AdminIdeaDeletedPage() {
  return (
    <AdminLayout>
      <AdminIdeaDeleted />
    </AdminLayout>
  );
}
