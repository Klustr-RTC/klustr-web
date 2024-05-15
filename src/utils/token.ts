import { jwtDecode } from "jwt-decode";

export const decodeToken = async (token: string) => {
  try {
    jwtDecode(token);
  } catch (error) {
    console.log(error);
  }
};
