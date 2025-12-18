import dynamic from 'next/dynamic';

const AdminMember = dynamic(() => import('../features/Admin/components/AdminMember/AdminMember'), {
  ssr: false,
});

export default function AdminMemberPage() {
  return <AdminMember />;
}
