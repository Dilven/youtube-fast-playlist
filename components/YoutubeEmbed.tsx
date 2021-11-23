import { useStore } from "store";

import { styled } from "@stitches/react";
import { ActionIcon } from "@mantine/core";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import YouTube from "react-youtube";

const Container = styled("div", {
  display: "inline-flex",
  flexDirection: "column",
  marginTop: "50px",
  alignItems: "center",
  marginLeft: "30px",
  padding: "10px",

  "& span": { display: "flex", alignItems: "center" },
});

const GoToTrack = styled("div", {
  display: "flex",
});
type Props = {
  scrollIntoView: ({
    alignment,
  }?: {
    alignment?: "start" | "end" | "center";
  }) => void;
};
export const YoutubeEmbed = (props: Props) => {
  const selectedTrack = useStore((state) => state.selectedTrack);
  const selectedTrackNumber = useStore((state) => state.selectedTrackNumber);
  return (
    <Container>
      {selectedTrack && (
        <>
          <YouTube
            videoId={selectedTrack}
            onEnd={() => {
              console.log("onEnd");
            }}
          />
          <GoToTrack>
            <span>Track: {selectedTrackNumber} </span>
            <ActionIcon
              color="yellow"
              onClick={() => {
                console.log("foo");
                props.scrollIntoView();
              }}
            >
              <ArrowRightIcon />
            </ActionIcon>
          </GoToTrack>
        </>
      )}
    </Container>
  );
};
