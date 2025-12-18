import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminProjectManage = dynamic(
  () => import('../features/Admin/components/AdminProjectManage/AdminProjectManage'),
  { ssr: false }
);

export default function AdminProjectPage() {
  return (
    <AdminLayout>
      <AdminProjectManage/>
    </AdminLayout>
  )
};
