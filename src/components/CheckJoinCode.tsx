import { useState } from 'react';
import { CustomButton } from './CustomButton';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Props = {
  onJoinCode: (code: string) => Promise<void>;
};

export const CheckJoinCode = ({ onJoinCode }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setLoading(true);
        await onJoinCode(code);
        setLoading(false);
      }}
      className="max-w-[400px] mx-auto my-10 border rounded-lg p-4 grid gap-3"
    >
      <h1 className="text-xl font-semibold">Enter Join Code to Join Room</h1>
      <div className="grid gap-2">
        <Label htmlFor="code">Join Code</Label>
        <Input
          value={code}
          required
          onChange={e => setCode(e.target.value)}
          type="number"
          id="code"
          placeholder="Enter Join Code"
        />
      </div>
      <CustomButton loading={loading} type="submit">
        Join Room
      </CustomButton>
    </form>
  );
};
