import dynamic from 'next/dynamic';

import AdminLayout from '../features/Admin/layout/AdminLayout';

const AdminProjectGallery = dynamic(
  () => import('../features/Admin/components/AdminProjectGallery/AdminProjectGallery'),
  { ssr: false }
);

export default function AdminProjectGalleryPage() {
  return (
    <AdminLayout>
      <AdminProjectGallery />
    </AdminLayout>
  );
}
