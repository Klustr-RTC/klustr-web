import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/home/page';
import { Login } from './pages/auth/login/page';
import { Register } from './pages/auth/signup/page';
import { Toaster } from 'sonner';
import { useTheme } from './components/theme-provider';
import { CreateRoom } from './pages/room/create/page';
import { webRoutes } from './constants/routes';
import useKlustrStore from './hooks/store';
import { decodeToken } from './utils/token';
import { ChatRoomPage } from './pages/room/chat/page';
import { VideoRoomPage } from './pages/room/Video/page';
import { UserService } from './helpers/UserService';
import Profile from './pages/profile/page';
import Notfound from './components/NotFound';
import { RoomService } from './helpers/RoomService';
import RedirectHandler from './pages/join/page';

function App() {
  const { theme } = useTheme();
  const setUserInfo = useKlustrStore(state => state.setUserInfo);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      loader: async () => {
        const token = localStorage.getItem('token');
        console.log(window.location.pathname);
        if (!token) {
          localStorage.setItem('redirectLink', window.location.pathname);
          return redirect(webRoutes.auth.login);
        }
        const data = decodeToken(token);
        if (data) {
          if (data.exp! * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.setItem('redirectLink', window.location.pathname);
            return redirect(webRoutes.auth.login);
          }
          const user = await UserService.getUserById(data.userId);
          if (user) {
            setUserInfo(user);
          } else {
            setUserInfo({
              email: data.email,
              username: data.given_name,
              id: data.userId
            });
          }
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
              path: 'chat/:id',
              element: <ChatRoomPage />
            },
            {
              path: 'media/:id',
              element: <VideoRoomPage />
            }
          ]
        },
        {
          path: 'profile',
          children: [
            {
              path: '',
              element: <Profile />
            }
          ]
        },
        {
          path: 'join/:code',
          loader: async ({ params }) => {
            console.log(params);
            const token = localStorage.getItem('token');
            if (!token) {
              localStorage.setItem('redirectLink', window.location.pathname);
              return { redirect: webRoutes.auth.login };
            }
            const data = decodeToken(token);
            if (data) {
              if (data.exp! * 1000 < Date.now()) {
                localStorage.removeItem('token');
                localStorage.setItem('redirectLink', window.location.pathname);
                return { redirect: webRoutes.auth.login };
              }
            }
            const res = await RoomService.getRoomByLink(params.code!);
            if (res) {
              if (res.type == 0) {
                return { redirect: webRoutes.room.chat(res.id) };
              } else {
                return { redirect: webRoutes.room.media(res.id) };
              }
            } else {
              return { redirect: '/notfound' };
            }
          },
          element: <RedirectHandler />
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
    },
    {
      path: '*',
      element: <Navbar />,
      children: [
        {
          path: '*',
          element: <Notfound />
        }
      ]
    }
  ]);
  return (
    <>
      <Toaster richColors={true} duration={1500} closeButton position="top-right" theme={theme} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
