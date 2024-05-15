/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'sonner';

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
        if (typeof error.response?.data == 'string') {
          toast.error(error.response.data);
        } else if (error.response?.data.errors) {
          Object.keys(error.response.data.errors).forEach(key => {
            toast.error(error.response?.data.errors[key]);
          });
        }
      } else {
        toast.error((error as Error).message);
      }
      return undefined;
    }
  };
};
