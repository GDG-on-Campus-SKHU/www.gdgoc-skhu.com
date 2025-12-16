import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminIdeaProject = dynamic(
  () => import('../features/Admin/components/AdminIdeaProject/AdminIdeaProject'),
  { ssr: false }
);

export default function AdminIdeaPage() {
  return (
    <AdminLayout>
      <AdminIdeaProject />
    </AdminLayout>
  );
}
