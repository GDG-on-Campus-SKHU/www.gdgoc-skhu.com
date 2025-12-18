import dynamic from 'next/dynamic';

const AdminProjectManage = dynamic(
  () => import('../features/Admin/components/AdminProjectManage/AdminProjectManage'),
  { ssr: false }
);

export default function AdminProjectPage() {
  return <AdminProjectManage />;
}
