import { useState } from 'react';
import { Link } from 'react-router-dom';

import XSvg from '../../../components/Xsvg';

import { MdOutlineMail } from 'react-icons/md';
import { MdPassword } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/login',
          formData,
          { withCredentials: true }
        );
        if (res.status !== 200) throw new Error('Something went wrong');
        const data = res.data;
        if (data.status === 'fail') throw new Error(data.message);
        console.log(data);
        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Login Successful');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen gap-5">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? <LoadingSpinner></LoadingSpinner> : 'Login'}
          </button>
          {isError && (
            <p className="text-red-500">{error.response.data.message}</p>
          )}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
