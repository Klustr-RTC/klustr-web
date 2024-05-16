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
