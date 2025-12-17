import dynamic from 'next/dynamic';

const AdminIdeaProject = dynamic(
  () => import('../features/Admin/components/AdminIdeaProject/AdminIdeaProject'),
  { ssr: false }
);

export default function AdminIdeaProjectPage() {
  return (
    <AdminIdeaProject />
  );
}
