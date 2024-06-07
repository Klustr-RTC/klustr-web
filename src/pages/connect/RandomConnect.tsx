import RandomRoom from './components/RandomRoom';
import { SocketProvider } from '@/hooks/useSocket';

function RandomConnect() {
  return (
    <SocketProvider>
      <RandomRoom />
    </SocketProvider>
  );
}

export default RandomConnect;
