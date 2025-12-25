import dynamic from 'next/dynamic';

const AdminIdeaDeleted = dynamic(
  () => import('../features/Admin/components/AdminIdeaDeleted/AdminIdeaDeleted'),
  { ssr: false }
);

export default function AdminIdeaDeletedPage() {
  return <AdminIdeaDeleted />;
}
