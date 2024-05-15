/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "sonner";

export const errorHandler = <T extends any[], R>(
  func: (...args: T) => Promise<R>
): ((...args: T) => Promise<R | undefined>) => {
  return async (...args: T) => {
    try {
      return await func(...args); // Execute the passed function with arguments
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // For Development
        console.log(error.response?.data);
        if (error.status == 400) {
          toast.error(error.response?.data.detail);
          error.response?.data.errors.forEach((error: any) => {
            toast.error(error.errorMessage);
          });
        } else {
          toast.error(error.response?.data.detail);
        }
      } else {
        toast.error((error as Error).message);
      }
      return undefined;
    }
  };
};
