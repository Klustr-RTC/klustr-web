import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const { id } = useParams();
  return <div>RoomPage : {id}</div>;
};
