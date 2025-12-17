import dynamic from 'next/dynamic';

const AdminSubsScreening = dynamic(
  () => import('../features/Admin/components/AdminSubsScreening/AdminSubsScreening'),
  { ssr: false }
);

export default function AdminSubsScreeningPage() {
  return <AdminSubsScreening />;
}
