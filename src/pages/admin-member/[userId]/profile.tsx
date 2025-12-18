import dynamic from 'next/dynamic';
import AdminLayout from '@/features/Admin/layout/AdminLayout';

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
