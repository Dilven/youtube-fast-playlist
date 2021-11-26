import { useStore } from "store";

import { styled } from "@stitches/react";
import { Button, Switch } from "@mantine/core";
import YouTube from "react-youtube";
import { useEffect } from "react";

const Container = styled("div", {
  display: "inline-flex",
  flexDirection: "column",
  marginTop: "50px",
  alignItems: "center",
  marginLeft: "30px",
  padding: "10px",

  "& span": { display: "flex", alignItems: "center" },
});

const Actions = styled("div", {
  display: "flex",
  alignItems: 'space-between',

  "& > *": {
    margin: '5px'
  }
});

type Props = {
  playlistId: string;
  scrollIntoView: ({
    alignment,
  }?: {
    alignment?: "start" | "end" | "center";
  }) => void;
};
export const YoutubeEmbed = (props: Props) => {
  const selectedTrack = useStore((state) => state.selectedTrack);
  const selectedTrackNumber = useStore((state) => state.selectedTrackNumber);
  const setTrackStatus = useStore((state) => state.setTrackStatus);
  const setAutoPlay = useStore((state) => state.setAutoPlay);
  const autoplay = useStore((state) => state.autoplay);
  return (
    <Container>
      {selectedTrack && (
        <>
          <YouTube
            videoId={selectedTrack}
            opts={{
              playerVars: {autoplay: autoplay ? 1 : 0 },
            }}
            onPlay={() => {
              setTrackStatus('play')
            }}
            onEnd={() => {
              setTrackStatus('finish')
            }}
            onPause={() => {
              setTrackStatus('pause')
            }}
          />
          <Actions>
            <Switch
              checked={autoplay}
              onClick={(event) => setAutoPlay(event.currentTarget.checked)}
              label="Autoplay"
            />
            <span>Track: {selectedTrackNumber} </span>
            <Button 
              variant="gradient"
              gradient={{ from: 'orange', to: 'red' }}
              component="a"
              href={`https://youtube.com/watch?v=${selectedTrack}&list=${props.playlistId}`}
              target="_blank"
            >
              Go to youtube
            </Button>
            <Button 
              variant="gradient" 
              onClick={() => {
                props.scrollIntoView();
              }}
              gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            >
              Scroll to track
            </Button>
          </Actions>
        </>
      )}
    </Container>
  );
};
