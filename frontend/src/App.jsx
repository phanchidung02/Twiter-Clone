import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/signup/SignUpPage';
import Login from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/SideBar';
import RightPanel from './components/common/RightPannel';
import Notification from './pages/notifications/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          withCredentials: true,
        });
        if (res.status !== 200) throw new Error('Something went wrong');
        const data = res.data;
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto gap-3">
      {authUser && <Sidebar></Sidebar>}
      <Routes>
        <Route
          path="/"
          element={
            authUser ? <HomePage></HomePage> : <Navigate to="/login"></Navigate>
          }
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <Login></Login> : <Navigate to="/"></Navigate>}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUp></SignUp> : <Navigate to="/"></Navigate>}
        ></Route>
        <Route
          path="/notifications"
          element={
            authUser ? (
              <Notification></Notification>
            ) : (
              <Navigate to="/login"></Navigate>
            )
          }
        ></Route>
        <Route
          path="/profile/:username"
          element={
            authUser ? (
              <ProfilePage></ProfilePage>
            ) : (
              <Navigate to="/login"></Navigate>
            )
          }
        ></Route>
      </Routes>
      {authUser && <RightPanel></RightPanel>}
      <Toaster></Toaster>
    </div>
  );
}

export default App;
