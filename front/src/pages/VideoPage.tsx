import { Flex } from "@chakra-ui/core";
import React, { useRef } from "react";
import ReactPlayer from "react-player";

interface QualityChangeEvent {
  mediaType: "video";
  newQuality: number;
  oldQuality: number;
  type: "qualityChangeRendered";
}

const url = "https://mimitube-videos.s3-eu-west-1.amazonaws.com/test/out.mpd";

const resolutions = [360, 720, 1080, 2160];

const VideoPage = () => {
  const ref = useRef<ReactPlayer>(null);

  return (
    <Flex>
      <ReactPlayer
        controls={true}
        playing={true}
        onReady={() => {
          if (!ref.current) {
            throw new Error("No ref");
          }

          const dashPlayer: any = ref.current.getInternalPlayer("dash");

          dashPlayer.on("qualityChangeRendered", (event: any) => {
            if (event.mediaType !== "video") {
              throw new Error(`Unknown mediaType: ${event.mediaType}`);
            }

            if (event.type !== "qualityChangeRendered") {
              throw new Error(`Unknown mediaType: ${event.mediaType}`);
            }

            const { newQuality } = event as QualityChangeEvent;

            console.log(`Switching to ${resolutions[newQuality]}`);
          });
        }}
        ref={ref}
        url={url}
        width="100%"
      />
    </Flex>
  );
};

export default VideoPage;
