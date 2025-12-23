import { useRouter } from 'next/router';
import ProfilePage from '@/features/team-building/pages/Profie';

export default function OtherUserProfilePage() {
  const router = useRouter();
  const { userId } = router.query;

  const parsed =
    typeof userId === 'string' ? Number(userId) : Array.isArray(userId) ? Number(userId[0]) : NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return <ProfilePage mode="other" userId={parsed} />;
}
