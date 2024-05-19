import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const Posts = ({ feedType, username, userId }) => {
  const postEndPoint = () => {
    switch (feedType) {
      case 'forYou':
        return 'all';
      case 'following':
        return 'following';
      case 'posts':
        return `user/${username}`;
      case 'likes':
        return `liked/${userId}`;
      default:
        return 'all';
    }
  };

  const POST_ENDPOINT = postEndPoint();
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
          `http://localhost:5000/api/posts/${POST_ENDPOINT}`,
          { withCredentials: true }
        );
        if (res.status !== 200) throw new Error('Something went wrong');

        const data = res.data;
        return data.data;
      } catch (err) {
        throw err;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

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
      {!isLoading && !isRefetching && post && (
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
