import dynamic from 'next/dynamic';

const AdminIdeaEdit = dynamic(
  () => import('../features/Admin/components/AdminIdeaEdit/AdminIdeaEdit'),
  {
    ssr: false,
  }
);

export default function AdminIdeaEditPage() {
  return <AdminIdeaEdit />;
}
