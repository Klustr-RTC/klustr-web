import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { webRoutes } from '@/constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../GoogleIcon';
import { CustomButton } from '@/components/CustomButton';
import { z } from 'zod';
import { RegisterSchema } from '@/types/auth';
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthService } from '@/helpers/AuthService';
const schema = z.object({
  Username: z
    .string()
    .min(3)
    .refine(
      val => {
        return !val.includes(' ');
      },
      { message: 'Username should not contain spaces' }
    )
    .transform(val => val.trim()),
  Email: z
    .string()
    .email()
    .transform(val => val.trim()),
  Password: z.string().min(6)
});

export function Register() {
  const [data, setData] = useState<RegisterSchema>({
    Username: '',
    Email: '',
    Password: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const validatedData = await schema.safeParseAsync(data);
      if (validatedData.success) {
        const res = await AuthService.register(data);
        if (res) {
          localStorage.setItem('token', res.token);
          toast.success('Registration successful');
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
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to register your account
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
              <Label htmlFor="username">Username</Label>
              <Input
                onChange={e => {
                  setData({ ...data, Username: e.target.value });
                }}
                id="username"
                type="text"
                placeholder="username"
                required
              />
            </div>
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
            <CustomButton isLoading={loading} type="submit">
              Register
            </CustomButton>
            <CustomButton variant="outline" className="w-full">
              <GoogleIcon /> Register with Google
            </CustomButton>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to={webRoutes.auth.login} className="underline">
              Login
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
