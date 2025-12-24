import { GetServerSideProps } from 'next';
import ProjectGalleryPage from '@/features/team-building/pages/ProjectGallery';

export default ProjectGalleryPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ua = req.headers['user-agent'] ?? '';
  const isMobile = /Android|iPhone|iPod/i.test(ua);

  if (isMobile) {
    return {
      redirect: {
        destination: '/?blocked=mobile',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
