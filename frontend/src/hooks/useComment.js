import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

function useComment() {
  const queryClient = useQueryClient();
  const { mutate: commentFn, isPending } = useMutation({
    mutationFn: async ({ id, text }) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/posts/comment/${id}`,
          {
            text,
          },
          { withCredentials: true }
        );
        if (res.status !== 200) throw new Error('Something went wrong');
        console.log(res.data);
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Commented');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },

    onError: () => {
      toast.error('fail');
    },
  });
  return { commentFn, isPending };
}

export default useComment;
