import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { webRoutes } from '@/constants/routes';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../GoogleIcon';
import { AuthService } from '@/helpers/AuthService';
import { useState } from 'react';
import { LoginSchema } from '@/types/auth';
import { z } from 'zod';
import { toast } from 'sonner';
import { CustomButton } from '@/components/CustomButton';
const schema = z.object({
  Email: z
    .string()
    .email()
    .transform(val => val.trim()),
  Password: z.string().min(6)
});

export function Login() {
  const [data, setData] = useState<LoginSchema>({
    Email: '',
    Password: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setGoogleLoading(true);
      const res = await AuthService.getUserInfoFromAccessToken(tokenResponse.access_token);
      if (res) {
        const user = await AuthService.getUserByEmail(res.email);
        if (user) {
          await login(tokenResponse.access_token, user.username);
        } else {
          toast.error('User not found! Please register first');
          navigate(webRoutes.auth.register);
        }
      } else {
        toast.error('Token Expired! Please try again');
      }

      setGoogleLoading(false);
    }
  });

  const login = async (access_token: string, username: string) => {
    const res = await AuthService.googleAuth({
      GoogleAccessToken: access_token,
      Username: username
    });
    if (res) {
      localStorage.setItem('token', res.token);
      toast.success('Login successful');
      navigate(webRoutes.home);
    }
  };
    
  const onSubmit = async () => {
    try {
      setLoading(true);
      const validatedData = await schema.safeParseAsync(data);
      if (validatedData.success) {
        const res = await AuthService.login(data);
        if (res) {
          localStorage.setItem('token', res.token);
          toast.success('Login successful');
          navigate(webRoutes.home);
        }
      } else {
        validatedData.error.errors.forEach(error => {
          toast.error(error.message);
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={e => {
                  setData({ ...data, Email: e.target.value });
                }}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                onChange={e => {
                  setData({ ...data, Password: e.target.value });
                }}
                id="password"
                type="password"
                required
              />
            </div>
            <CustomButton loading={loading} type="submit">
              Login
            </CustomButton>
            <CustomButton
              loading={googleLoading}
              variant="outline"
              onClick={() => googleLogin()}
              className="w-full"
            >
              {!googleLoading && <GoogleIcon />} Login with Google
            </CustomButton>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to={webRoutes.auth.register} className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://source.unsplash.com/1920x1080/?nature,water"
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
