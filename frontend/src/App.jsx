import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/signup/SignUpPage';
import Login from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/SideBar';
import RightPanel from './components/common/RightPannel';
import Notification from './pages/notifications/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <div className="flex max-w-6xl mx-auto gap-3">
      <Sidebar></Sidebar>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route
          path="/notifications"
          element={<Notification></Notification>}
        ></Route>
        <Route
          path="/profile/johndoe"
          element={<ProfilePage></ProfilePage>}
        ></Route>
      </Routes>
      <RightPanel></RightPanel>
    </div>
  );
}

export default App;
