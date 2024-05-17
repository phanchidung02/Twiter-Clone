import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignUp from './pages/auth/signup/SignUpPage';
import Login from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage></HomePage>,
  },
  {
    path: '/login',
    element: <Login></Login>,
  },
  {
    path: '/signup',
    element: <SignUp></SignUp>,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
