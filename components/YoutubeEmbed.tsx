import { useStore } from "store";

import { styled } from "@stitches/react";
import { ActionIcon } from "@mantine/core";
import { ArrowRightIcon } from "@radix-ui/react-icons";

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
          <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${selectedTrack}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
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
