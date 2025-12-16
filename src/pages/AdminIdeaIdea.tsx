import dynamic from 'next/dynamic';
import AdminLayout from '../features/Admin/layout/AdminLayout';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminIdeaIdea = dynamic(
  () => import('../features/Admin/components/AdminIdeaIdea/AdminIdeaIdea'),
  { ssr: false }
);

export default function AdminIdeaIdeaPage() {
  return (
    <AdminLayout>
      <AdminIdeaIdea />
    </AdminLayout>
  );
}
