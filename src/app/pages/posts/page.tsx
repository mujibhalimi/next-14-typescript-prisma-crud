"use client";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { fetchPosts, deletePost } from "@/app/actions/postAction";
import Add from "./add/page";

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
  const [dataSource, setDataSource] = useState({});
  const [isMessage, setIsMessage] = useState(false);
  const [messageData, setMessageData] = useState("");
  const queryClient = useQueryClient();

  const { data, error } = useQuery<{ data: Post[]; pagination: Pagination }>({
    queryKey: ["posts", page, pageSize],
    queryFn: () => fetchPosts(page.toString(), pageSize.toString()),
  });

  const dataLength = data?.data?.length;
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      console.log("Post deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts", page, pageSize],
      });
    },
  });

  const handleDelete = (post: Post) => {
    setIsMessage(true);
    deleteMutation.mutate(post.id);
    setMessageData("Post Deleted Successfully");
    setTimeout(() => {
      setIsMessage(false);
      setMessageData("");
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
            {isMessage && (
              <div className="flex items-center justify-center bg-green-400 rounded-lg p-2">
                <svg
                  className="w-6 h-6 text-white mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-2xl font-bold text-white">
                  {messageData}
                </span>
              </div>
            )}

            <button
              type="button"
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-800"
              onClick={() => {
                setIsOpen(true);
                setDataSource({});
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
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataLength ? (
                data?.data?.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="px-4 py-2">{post.title}</td>
                    <td className="px-4 py-2">{post.content}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-800"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-800"
                        onClick={() => handleDelete(post)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {dataLength && data?.pagination?.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-400"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="flex mx-4">
                {pageNumbers.length > 0 &&
                  pageNumbers.map((number) => (
                    <button
                      key={number}
                      className={`mx-1 p-2 rounded-md ${
                        page === number
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  ))}
              </div>
              <button
                className="bg-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-400"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data?.pagination?.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <Add
          isOpen={isOpen}
          dataSource={dataSource}
          isMessage={isMessage}
          messageData={messageData}
          setIsMessage={setIsMessage}
          setMessageData={setMessageData}
          setIsOpen={setIsOpen}
        />
      )}
    </HydrationBoundary>
  );
}
