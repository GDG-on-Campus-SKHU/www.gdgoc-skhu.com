import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useAuthStore } from '../../../lib/authStore';

const AdminDashboard = dynamic(
  () => import('../../../features/Admin/components/AdminDashboard/AdminDashboard'),
  { ssr: false }
);

export default function Admin() {
  const router = useRouter();
  const { accessToken, role, hydrateFromSession } = useAuthStore();

  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  useEffect(() => {
    if (accessToken === null) return;

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    if (role !== 'ROLE_SKHU_ADMIN') {
      router.replace('/');
    }
  }, [accessToken, role, router]);

  if (!accessToken || role !== 'ROLE_SKHU_ADMIN') {
    return null;
  }

  return <AdminDashboard />;
}
