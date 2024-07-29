"use client";

import { useState } from 'react';
import { useQuery,useMutation,useQueryClient, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { fetchPosts,deletePost } from "@/app/actions/postAction";
import Add from './add/page';

type Post = {
  id: number;
  title: string;
  content: string;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};


type AppProps = {
  dehydratedState: DehydratedState;
};

export default function App({ dehydratedState }: AppProps) {
  const [page, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSource,setDataSource]=useState({});
  const [isMessage,setIsMessage]=useState(false);
  const [messageData,setMessageData]=useState('');
  const queryClient = useQueryClient();

  const { data, error } = useQuery<{ data: Post[], pagination: Pagination }>({
    queryKey: ['posts', page, pageSize],
    queryFn: () => fetchPosts(page.toString(), pageSize.toString()),
  });

  const [isOpen, setIsOpen] = useState(false);


  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      console.log('Post deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['posts', page, pageSize],
      });
    },
  });

  const handleDelete = (post: Post) => {
    setIsMessage(true);
    deleteMutation.mutate(post.id);
    setMessageData('Post Deleted Successfully');
    setTimeout(() => {
      setIsMessage(false);
      setMessageData('');
    }, 1500);
  };

  const handleEdit = (post: Post) => {
    setDataSource(post);
    setIsOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const pageNumbers = [];
  for (let i = 1; i <= (data?.pagination?.totalPages || 0); i++) {
    pageNumbers.push(i);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mt-6">All Posts</h1>
            {isMessage && <span className='text-2xl font-bold text-black bg-green-400 p-2 rounded-lg'>{messageData}</span>
            }
            <button
              type='button'
              className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-800'
              onClick={() => {
                setIsOpen(true)
                setDataSource({})
              }}
            >
              Add Post
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className='px-4 py-2 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">{post.content}</td>
                  <td className='px-4 py-2'>
                    <button className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-800'
                      onClick={() => handleEdit(post)}
                    >Edit</button>
                    <button className='bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-800'
                      onClick={() => handleDelete(post)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              className='bg-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-400'
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <div className="flex mx-4">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`mx-1 p-2 rounded-md ${page === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              className='bg-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-400'
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data?.pagination?.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isOpen && <Add isOpen={isOpen} dataSource={dataSource}
        isMessage={isMessage}
        messageData={messageData}
       setIsMessage={setIsMessage}
        setMessageData={setMessageData} 
         setIsOpen={setIsOpen} />}
    </HydrationBoundary>
  );
}
