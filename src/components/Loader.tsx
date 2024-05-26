import { Loader as MyLoader } from 'lucide-react';
export const Loader = ({ loading }: { loading?: boolean }) => {
  return loading ? (
    <div className="flex justify-center items-center flex-1 py-10 w-full">
      <MyLoader className="w-10 h-10 animate-spin" />
    </div>
  ) : null;
};
