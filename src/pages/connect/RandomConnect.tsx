import { useState } from "react";
import Start from "./components/Start";
import RandomRoom from "./components/RandomRoom";

function RandomConnect() {
  const [isStarted, setIsStarted] = useState<boolean>(false);

  return (
    <div className="">
      {
        !isStarted ?
          <Start setStarted={setIsStarted} />
          :
          <RandomRoom />
      }
    </div>
  )
}

export default RandomConnect;
