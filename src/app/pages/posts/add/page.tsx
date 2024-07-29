import { useState, useEffect } from 'react';
import { submitPost, updatePost } from '@/app/actions/postAction';
import { useQueryClient } from '@tanstack/react-query';

type PostData = {
  id?: number,
  title: string,
  content: string,
}

type Props = {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  dataSource: PostData | any,
  messageData:string,
  setMessageData: (messageData:string)=>void,
  isMessage: boolean,
  setIsMessage: (isMessage:boolean)=>void,
}

export default function App({ isOpen, setIsOpen, dataSource,setMessageData,setIsMessage }: Props) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PostData>({ title: '', content: '' });

  useEffect(() => {
    if (dataSource) {
      setFormData({ title: dataSource.title, content: dataSource.content });
    }
  }, [dataSource]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const createFormData = (data: PostData): FormData => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.id !== undefined) {
      formData.append('id', data.id.toString());
    }
    return formData;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = createFormData(formData);
      
      if (dataSource?.id) {
        await updatePost(dataSource.id, postData);
        setMessageData('Post update successfully');
        setIsMessage(true);
      } else {
        await submitPost(postData);
        setMessageData('Post added successfully');
        setIsMessage(true);
      }
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsOpen(false);
      setTimeout(() => {
        setIsMessage(false);
        setMessageData('');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit form', error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${isOpen ? 'block' : 'hidden'}`} id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <button type='button' className='bg-none float-right p-2 mb-5' onClick={() => setIsOpen(false)}>X</button>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder='Enter title'
            value={formData.title}
            name="title"
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder='Enter content'
            value={formData.content}
            name="content"
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            onChange={handleChange}
          />
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-800">
            {dataSource?.id ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
