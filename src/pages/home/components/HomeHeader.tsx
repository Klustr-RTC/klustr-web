import { CustomButton } from '@/components/CustomButton';
import { webRoutes } from '@/constants/routes';
import { Filter, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterDialog } from './FilterDialog';
import { RoomQueryObject } from '@/types/room';

type Props = {
  onFilter: (query: RoomQueryObject) => Promise<void>;
  onClear: () => Promise<void>;
  filtered: boolean;
};

export const HomeHeader = (props: Props) => {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">ROOMS</div>
          <p className="tracking-wider max-sm:text-sm opacity-70 font-semibold">
            Join Rooms. Share Ideas.
          </p>
        </div>
        <div className="flex gap-2">
          {props.filtered && (
            <CustomButton className="flex gap-1 h-10" onClick={props.onClear} variant={'outline'}>
              <X className="size-5" /> Clear Filter
            </CustomButton>
          )}
          <CustomButton
            onClick={() => setFilterOpen(true)}
            variant={'outline'}
            size={'icon'}
            className="size-10"
          >
            <Filter className="h-6 w-6" />
          </CustomButton>
          <Link to={webRoutes.room.create}>
            <CustomButton variant={'outline'} size={'icon'} className="size-10">
              <Plus className="h-6 w-6" />
            </CustomButton>
          </Link>
        </div>
      </div>
      <FilterDialog
        onFilter={props.onFilter}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      />
    </>
  );
};
