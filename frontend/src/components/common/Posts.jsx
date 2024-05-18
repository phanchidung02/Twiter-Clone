import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const Posts = ({ feedType }) => {
  const postEndPoint = feedType === 'forYou' ? 'all' : 'following';

  const {
    data: post,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts/${postEndPoint}`,
          { withCredentials: true }
        );
        if (res.status !== 200) throw new Error('Something went wrong');

        const data = res.data;
        console.log(data);
        return data.data;
      } catch (err) {
        throw err;
      }
    },
  });

  useEffect(
    function () {
      refetch();
    },
    [feedType, refetch]
  );
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {(!isLoading || !isRefetching) && post?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && post && (
        <div>
          {post.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
