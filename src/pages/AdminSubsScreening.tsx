import dynamic from 'next/dynamic';
import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminSubsScreening = dynamic(
  () => import('../features/Admin/components/AdminSubsScreening/AdminSubsScreening'),
  { ssr: false }
);

export default function AdminSubsScreeningPage() {
  return (
    <AdminLayout>
      <AdminSubsScreening />
    </AdminLayout>
  );
}
