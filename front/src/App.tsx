import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const url = "https://mimitube-videos.s3-eu-west-1.amazonaws.com/test/out.mpd";

const App = () => {
  const ref = useRef<ReactPlayer>(null);

  const [activeStream, setActiveStream] = useState({ id: -1, index: -1, isLast: false });

  return (
    <>
      <p>id: {activeStream.id}</p>
      <p>index: {activeStream.index}</p>
      <p>isLast: {activeStream.isLast ? "true" : "false"}</p>

      <ReactPlayer
        controls={true}
        playing={true}
        onReady={() => {
          if (!ref.current) {
            throw new Error("No ref");
          }

          const dashPlayer: any = ref.current.getInternalPlayer("dash");

          setInterval(() => {
            const { id, index, isLast } = dashPlayer.getActiveStream().getStreamInfo();
            if (activeStream.id !== id) {
              setActiveStream({ id, index, isLast });
            }
          });

          console.log(dashPlayer);
          dashPlayer.on("qualityChangeRendered", console.log);
        }}
        ref={ref}
        url={url}
      />
    </>
  );
};

export default App;
