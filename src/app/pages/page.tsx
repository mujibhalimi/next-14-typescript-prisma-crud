import { QueryClient, dehydrate, DehydratedState } from '@tanstack/react-query';
import { fetchPosts } from "@/app/actions/postAction";
import App from './posts/page';

export default async function Home() {
  const queryClient = new QueryClient();

  // Define default values for page and pageSize
  const page = "1";
  const pageSize = "10";

  await queryClient.prefetchQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => fetchPosts(page, pageSize),
  });

  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <>
      <App dehydratedState={dehydratedState} />
    </>
  );
}
