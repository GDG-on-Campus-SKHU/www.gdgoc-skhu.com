import AdminDashboard from '../features/Admin/components/AdminDashboard/AdminDashboard';
import AdminLayout from '../features/Admin/layout/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
