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
  Email: string;
  Username: string;
  GoogleId: string;
  GoogleAccessToken: string;
  GoogleRefreshToken: string;
};
