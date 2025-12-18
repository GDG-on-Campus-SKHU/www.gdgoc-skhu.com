import dynamic from 'next/dynamic';
import AdminLayout from '@/features/Admin/layout/AdminLayout';

const AdminMemberProfileEdit = dynamic(
  () => import('../../../features/Admin/components/AdminMemberProfileEdit/AdminMemberProfileEdit'),
  { ssr: false }
);

export default function AdminMemberProfileEditPage() {
  return (
    <AdminLayout>
      <AdminMemberProfileEdit />
    </AdminLayout>
  );
}
