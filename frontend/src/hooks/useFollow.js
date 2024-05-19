import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

function useFollow() {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/follow/${id}`,
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
    onSuccess: () => {
      toast.success('Followed');
      queryClient.invalidateQueries({ queryKey: ['suggestedUser'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: () => toast.error('Not Follow'),
  });
  return { follow, isPending };
}

export default useFollow;
