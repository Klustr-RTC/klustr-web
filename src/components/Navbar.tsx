import { AlignLeft, Globe, Home, LogOut, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';
import { webRoutes } from '@/constants/routes';
import { toast } from 'sonner';
import LogoIcon from './LogoIcon';
import { useState } from 'react';

const routes = [
  {
    path: webRoutes.home,
    name: 'Home',
    icon: <Home className="h-5 w-5" />
  },
  {
    path: webRoutes.profile,
    name: 'Profile',
    icon: <User className="h-5 w-5" />
  },
  {
    path: webRoutes.room.create,
    name: 'Create Room',
    icon: <Plus className="h-5 w-5" />
  },
  {
    path: webRoutes.connect,
    name: 'Chat with random',
    icon: <Globe className='h-5 w-5' />
  }
];

export function Navbar() {
  const navigate = useNavigate();
  const [sideMenu, setSideMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful');
    navigate(webRoutes.auth.login);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-muted bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            to={webRoutes.home}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <LogoIcon color="white" className="size-6 transition-all group-hover:scale-110" />
            <span className="sr-only">Klustr</span>
          </Link>
          {routes.map((route, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={route.path}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {route.icon}
                  <span className="sr-only">{route.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{route.name}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <ModeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={logout}
                className="flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col  sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-muted bg-background px-4 sm:static sm:h-auto sm:py-2 sm:bg-background sm:px-6">
          <Sheet open={sideMenu} onOpenChange={() => setSideMenu(!sideMenu)} >
            {/* <SheetTrigger asChild> */}
            <Button onClick={() => setSideMenu(!sideMenu)} size="icon" variant="outline" className="sm:hidden">
              <AlignLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            {/* </SheetTrigger> */}
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <div onClick={() => { setSideMenu(!sideMenu); navigate("/") }}>
                    <LogoIcon color="white" className="size-6 transition-all group-hover:scale-110" />
                  </div>
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {routes.map((route, index) => (
                  <Link
                    onClick={() => setSideMenu(false)}
                    to={route.path}
                    key={index}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
                <div
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="text-3xl font-bold tracking-wider py-[0.5px]">
            <span className="text-primary">K</span>lustr
            <span className="font-light text-xl max-sm:hidden">
              {' '}
              - Connect and Collaborate in Real-Time.
            </span>
          </div>
          <div className='absolute sm:hidden right-2'>
            <ModeToggle />
          </div>
        </header>
        <main className="items-start px-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
