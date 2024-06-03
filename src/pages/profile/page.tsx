import { UserService } from '@/helpers/UserService';
import useKlustrStore from '@/hooks/store';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader, LoaderCircle, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { User } from '@/types/auth';

function Profile() {
  const userInfo = useKlustrStore<User>(state => state.userInfo!);
  const setUserInfo = useKlustrStore(state => state.setUserInfo);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const resp = await UserService.updateUser(values);
      if (resp) {
        setUserInfo(resp);
        toast.success('Profile updated successfully');
        setIsEdit(false);
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', `${import.meta.env.VITE_CLOUDINARY_PRESET}`);
      formData.append('cloud_name', `${import.meta.env.VITE_CLOUDINARY_NAME}`);

      const { data } = await axios.post(`${import.meta.env.VITE_CLOUDINARY_API}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (Object.prototype.hasOwnProperty.call(data, 'secure_url')) {
        const body = userInfo;
        body.avatar = data.secure_url;
        const resp = await UserService.updateUser(userInfo);
        if (resp?.status == 500) {
          return toast.error(resp.data);
        } else {
          setUserInfo(resp)
          toast.success('Avatar updated successfully');
        }
      } else {
        toast.error('Cannot upload the avatar! Try again');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUploading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();
  useEffect(() => {
    setValue('username', userInfo?.username);
    setValue('email', userInfo?.email);
    setValue('avatar', userInfo?.avatar);
    setValue('id', userInfo?.id);
  }, [userInfo, isEdit]);

  return (
    <div className="flex justify-center mt-[5vh] p-2">
      <Card className="w-full sm:w-[80%] lg:w-[40%]">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Your profile details will be visible to others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex justify-center">
              <label htmlFor={`${isEdit ? 'avatar' : null}`}>
                <div className="relative flex items-center justify-center">
                  <Avatar
                    className={`w-[150px] h-[150px] ${isEdit && 'opacity-50 cursor-pointer'}`}
                  >
                    <AvatarImage src={userInfo?.avatar} className="object-cover overflow-visible" />
                    <AvatarFallback>{userInfo?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isEdit ? (
                    uploading ? (
                      <LoaderCircle className="w-10 h-10 animate-spin absolute cursor-pointer" />
                    ) : (
                      <Pencil className="absolute cursor-pointer opacity-80" />
                    )
                  ) : null}
                </div>
              </label>
              <input
                disabled={uploading}
                hidden
                id="avatar"
                onChange={handleImageUpload}
                type="file"
                accept="image/jpg, image/png, image/jpeg"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input
                {...register('username', {
                  required: true
                })}
                disabled={!isEdit}
                id="name"
                placeholder="Enter your username"
              />
              {errors.username && errors.username.type == 'required' && (
                <p className="text-sm text-red-500">Username cannot be blank</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Email</Label>
              <Input
                {...register('email', {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                })}
                disabled={!isEdit}
                id="name"
                placeholder="Enter your email"
              />
              {errors.email && errors.email.type == 'required' && (
                <p className="text-sm text-red-500">Email cannot be blank</p>
              )}
              {errors.email && errors.email.type == 'pattern' && (
                <p className="text-sm text-red-500">Email is invalid</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          {!isEdit ? (
            <Button
              onClick={() => {
                setIsEdit(true);
              }}
              className="m-auto"
            >
              Update
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
              <Button className="flex items-center" onClick={handleSubmit(onSubmit)}>
                {isLoading && <Loader className="animate-spin h-5 w-5 mr-1" />} Submit
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
export default Profile;
