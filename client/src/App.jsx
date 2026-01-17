import { useState, useEffect } from "react";
import VideoCall from "./components/VideoCall";
import {socket} from "./socket/socket.js";
import TakeData from "./components/TakeData.jsx";
import useRoomStore from "./store/roomStore.js";

function App() {
  const [roomId, setRoomId] = useState(null);
      const { setRoomId: setRoomIdStore, setPeer } = useRoomStore();

  useEffect(() => {
    const onMatchFound = (payload) => {
      console.log("match_found payload:", payload);

      // your server sends: { roomId, userId, peer }
      const rid = payload?.roomId;
      setRoomIdStore(rid);
      const userId2 = payload?.peer;
      setPeer(userId2);
      console.log("Extracted roomId:", rid);
      if (!rid) return;

      setRoomId(rid);

      socket.emit("join_room", rid);
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, []);

  return (
    <div>
      {!roomId ? (
        <div>
          <h2>Waiting for match...</h2>
          <TakeData />
        </div>
      ) : (
        <VideoCall roomId={roomId} />
      )}
    </div>
  );
}

export default App;
