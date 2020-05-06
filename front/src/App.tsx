import { Flex } from "@chakra-ui/core";
import React, { useRef } from "react";
import ReactPlayer from "react-player";
import HomePage from "./pages/HomePage";

interface QualityChangeEvent {
  mediaType: "video";
  newQuality: number;
  oldQuality: number;
  type: "qualityChangeRendered";
}

const url = "https://mimitube-videos.s3-eu-west-1.amazonaws.com/test/out.mpd";

const resolutions = [360, 720, 1080, 2160];

const App = () => {
  const ref = useRef<ReactPlayer>(null);

  return (
    <Flex>
      <HomePage />
    </Flex>
  );
};

export default App;
