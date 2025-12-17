import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminIdeaEdit = dynamic(
  () => import('../features/Admin/components/AdminIdeaEdit/AdminIdeaEdit'),
  {
    ssr: false,
  }
);

export default function AdminIdeaEditPage() {
  return (
    <AdminLayout>
      <AdminIdeaEdit />
    </AdminLayout>
  );
}
