import { CustomButton } from '@/components/CustomButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RoomQueryObject } from '@/types/room';
import { useState } from 'react';

type Props = {
  filterOpen: boolean;
  setFilterOpen: (value: boolean) => void;
  onFilter: (query: RoomQueryObject) => Promise<void>;
};

export const FilterDialog = ({ filterOpen, setFilterOpen, onFilter }: Props) => {
  const [query, setQuery] = useState<RoomQueryObject>({});
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    const body: RoomQueryObject = {
      ...query,
      description: query.description?.length == 0 ? undefined : query.description,
      name: query.name?.length == 0 ? undefined : query.name
    };
    setLoading(true);
    await onFilter(body);
    setLoading(false);
    setFilterOpen(false);
  };
  return (
    <>
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Rooms</DialogTitle>
            <DialogDescription>
              Filter rooms by name, description, type, or visibility.
            </DialogDescription>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
              onReset={() => {
                setQuery({});
              }}
              className="grid gap-5 py-3"
            >
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={query.name ?? ''}
                  onChange={e => setQuery({ ...query, name: e.target.value })}
                  type="text"
                  placeholder="Filter Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={query.description ?? ''}
                  onChange={e => setQuery({ ...query, description: e.target.value })}
                  type="text"
                  placeholder="Filter Description"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 grid-cols-1">
                <div className="grid gap-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={query.isPublic == undefined ? '' : query.isPublic ? 'true' : 'false'}
                    onValueChange={val => {
                      setQuery({ ...query, isPublic: val == 'true' ? true : false });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'true'}>Public</SelectItem>
                      <SelectItem value={'false'}>Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select
                    value={query.type?.toString() ?? ''}
                    onValueChange={value => {
                      if (value == '1') {
                        setQuery({ ...query, type: 1 });
                      } else {
                        setQuery({ ...query, type: 0 });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'0'}>Chat Only</SelectItem>
                      <SelectItem value={'1'}>Audio/Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CustomButton type="reset" variant={'outline'}>
                  Clear
                </CustomButton>
                <CustomButton loading={loading} type="submit">
                  Filter
                </CustomButton>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
