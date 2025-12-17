import AdminLayout from '@/features/Admin/layout/AdminLayout';
import dynamic from 'next/dynamic';

const AdminMemberProfile = dynamic(
  () => import('../../../features/Admin/components/AdminMemberProfile/AdminMemberProfile'),
  { ssr: false }
);

export default function AdminMemberProfilePage() {
  return (
    <AdminLayout>
      <AdminMemberProfile />
    </AdminLayout>
  );
}
