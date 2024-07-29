export const fetchPosts = async (page:string,pageSize:string) => {
    const response = await fetch(`/api/route?page=${parseInt(page)}&pageSize=${parseInt(pageSize)}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const pagination={
        currentPage:data.currentPage,
        totalPages:data.totalPages,
        totalPosts:data.totalPosts
      }
      return { data: data.posts,pagination };
    } else {
      throw new Error('Failed to fetch posts');
    }
  };

  export const fetchPost = async (id: string) => {
    const response = await fetch(`/api/route/${id}`, { cache: 'no-store' });
    if (response.ok) {
      return response.json();
    }
    else {
      throw new Error('Failed to fetch post');
    }
  }
  
  export const submitPost = async (formData: FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const response = await fetch('/api/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to submit post');
    }
  };
  
  export const updatePost = async (id: number, formData: FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const response = await fetch(`/api/route/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to submit post');
    }
  }

  export const deletePost = async (id: number) => {
    const response = await fetch(`/api/route/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to delete post');
    }
  }