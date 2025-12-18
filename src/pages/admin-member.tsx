import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminMember = dynamic(() => import('../features/Admin/components/AdminMember/AdminMember'), {
  ssr: false,
});

export default function AdminMemberPage() {
  return (
    <AdminLayout>
      <AdminMember />
    </AdminLayout>
  );
}
