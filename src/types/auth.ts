import { JwtPayload } from 'jwt-decode';
export type LoginSchema = {
  Email: string;
  Password: string;
};

export type RegisterSchema = {
  Email: string;
  Password: string;
  Username: string;
};

export type GoogleAuthSchema = {
  Username: string;
  GoogleAccessToken: string;
};

export type User = {
  email: string;
  username: string;
  id: string;
};

export type AuthPayload = JwtPayload & {
  userId: string;
  email: string;
  given_name: string;
};
