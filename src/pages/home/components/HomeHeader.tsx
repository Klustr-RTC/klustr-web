import { CustomButton } from '@/components/CustomButton';
import { Filter, Plus } from 'lucide-react';

export const HomeHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Rooms</div>
        <div className="flex gap-2">
          <CustomButton variant={'outline'} size={'icon'} className="size-10">
            <Filter className="h-6 w-6" />
          </CustomButton>
          <CustomButton variant={'outline'} size={'icon'} className="size-10">
            <Plus className="h-6 w-6" />
          </CustomButton>
        </div>
      </div>
    </>
  );
};
