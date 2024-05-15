export const webRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  home: "/",
};

export const apiRoutes = {
  account: {
    login: "account/login",
    register: "account/register",
    googleAuth: "account/google-auth",
    findByEmail: (email: string) => `account/findByEmail?email=${email}`,
  },
};
