import dynamic from 'next/dynamic';
import AdminLayout from '../features/Admin/layout/AdminLayout';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminIdeaDetail = dynamic(
  () => import('../features/Admin/components/AdminIdeaDetail/AdminIdeaDetail'),
  { ssr: false }
);

export default function AdminIdeaDetailPage() {
  return (
    <AdminLayout>
      <AdminIdeaDetail />
    </AdminLayout>
  );
}
