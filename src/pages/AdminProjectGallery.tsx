import dynamic from 'next/dynamic';

const AdminProjectGallery = dynamic(
  () => import('../features/Admin/components/AdminProjectGallery/AdminProjectGallery'),
  { ssr: false }
);

export default function AdminProjectGalleryPage() {
  return <AdminProjectGallery />;
}
