import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { mutate: updatedProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/updated`,
          data,
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
      toast.success('Success');
      Promise.all([
        (queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfile'] })),
      ]);
    },
    onError: () => toast.error('Error in Profile'),
  });
  return { updatedProfile, isUpdatingProfile };
}

export default useUpdateProfile;
