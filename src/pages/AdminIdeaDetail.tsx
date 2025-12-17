import dynamic from 'next/dynamic';

const AdminIdeaDetail = dynamic(
  () => import('../features/Admin/components/AdminIdeaDetail/AdminIdeaDetail'),
  { ssr: false }
);

export default function AdminIdeaDetailPage() {
  return (
    <AdminIdeaDetail />
  );
}
