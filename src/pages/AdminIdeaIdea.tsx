import dynamic from 'next/dynamic';

const AdminIdeaIdea = dynamic(
  () => import('../features/Admin/components/AdminIdeaIdea/AdminIdeaIdea'),
  { ssr: false }
);

export default AdminIdeaIdea;
