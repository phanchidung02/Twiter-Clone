import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

function useLike() {
  const queryClient = useQueryClient();
  const { mutate: like, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/posts/like/${id}`,
          {},
          { withCredentials: true }
        );
        if (res.status !== 200) throw new Error('Something went wrong');
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    onSuccess: (updatedData, id) => {
      //   queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post liked successfully');
      queryClient.setQueryData(['posts'], (oldData) => {
        return oldData.map((old) => {
          if (old._id === id) {
            return { ...old, likes: updatedData };
          }
          return old;
        });
      });
    },
    onError: () => {
      toast.error('Huhu');
    },
  });
  return { like, isPending };
}

export default useLike;
