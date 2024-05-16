import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/home/page';
import { Login } from './pages/auth/login/page';
import { Register } from './pages/auth/signup/page';
import { Toaster } from 'sonner';
import { useTheme } from './components/theme-provider';
import { CreateRoom } from './pages/room/create/page';
import { RoomPage } from './pages/room/page';
import { webRoutes } from './constants/routes';
import useKlustrStore from './hooks/store';
import { decodeToken } from './utils/token';

function App() {
  const { theme } = useTheme();
  const setUserInfo = useKlustrStore(state => state.setUserInfo);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      loader: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          return redirect(webRoutes.auth.login);
        }
        const data = decodeToken(token);
        if (data) {
          setUserInfo({
            email: data.email,
            id: data.userId,
            username: data.given_name
          });
        }
        return null;
      },
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'room',
          children: [
            {
              path: 'create',
              element: <CreateRoom />
            },
            {
              path: ':id',
              element: <RoomPage />
            }
          ]
        }
      ]
    },
    {
      path: '/auth',
      loader: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          return redirect(webRoutes.home);
        }
        return null;
      },
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        }
      ]
    }
  ]);
  return (
    <>
      <Toaster richColors={true} closeButton position="top-right" theme={theme} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
