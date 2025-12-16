import AdminLayout from '../features/Admin/layout/AdminLayout';
import AdminDashboard from '../features/Admin/components/AdminDashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
