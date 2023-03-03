import {
  Col,
  Container,
  Grid,
  Loader,
  Notification,
  Pagination,
} from "@mantine/core";
import { blackA } from "@radix-ui/colors";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { Cross1Icon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import { useYoutubeContext } from "hooks/useYoutubeContext";
import Image from "next/image";
import { MutableRefObject } from "react";
import { MAX_RESULTS_PER_PAGE_API } from "services/youtube";

const Img = styled(Image, {
  objectFit: "cover",
  width: "100%",
});
const Box = styled("div", {});

const PlaylistGrid = styled(Grid, {
  marginTop: "15px",
  maxHeight: "calc(100vh - 195px)",
  overflowY: "scroll",
  overflowX: "unset",
  width: "100%",
  marginBottom: "10px",
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
    "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar": {
    width: "12px",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fee36e",
  },
  "& > li": {
    minWidth: "100%",
  },
}) as any;

const PlaylistItem = styled(Col, {
  cursor: "pointer",
  padding: "15px",
  variants: {
    type: {
      selected: {
        border: "1px solid #222",
        boxShadow: "3px 3px 0 #222",
        borderWidth: "3px 3px 5px 5px",
        borderRadius: "4% 95% 6% 95%/95% 4% 92% 5%",
      },
    },
  },
});
const TrackNumber = styled("span", {
  variants: {
    type: {
      selected: {
        color: "#fee36e",
        fontWeight: "bold",
      },
    },
  },
});

const TrackTitle = styled("h3", {
  maxWidth: "230px",
  margin: "0",
  display: "block",
});
type Props = {
  playlistId: string;
  scrollableRef: MutableRefObject<null>;
  targetRef: MutableRefObject<any>;
};
export const Playlist = (props: Props) => {
  const {
    error,
    data,
    isFetching,
    onChangePage,
    page,
    setSelectedTrack,
    selectedTrackNumber,
  } = useYoutubeContext();
  if (error) {
    return (
      <Notification icon={<Cross1Icon />} onClose={() => {}} color="red">
        Something went wrong
      </Notification>
    );
  }

  return (
    <Container>
      <h1>My playlist</h1>
      {isFetching ? (
        <Loader color="#CED4DA" size="xl" variant="bars" />
      ) : (
        <>
          {data && data.pageInfo && (
            <>
              <Pagination
                color="yellow"
                radius="lg"
                withEdges
                page={page}
                onChange={onChangePage}
                total={Math.ceil(
                  data.pageInfo.totalResults / data.pageInfo.resultsPerPage
                )}
              />
              <PlaylistGrid grow gutter="xs" ref={props.scrollableRef}>
                {data.items.map(({ id, snippet }, index) => {
                  const { title, thumbnails, resourceId } = snippet;
                  const trackNumber =
                    (page - 1) * MAX_RESULTS_PER_PAGE_API + index + 1;
                  const isSelected = trackNumber === selectedTrackNumber;
                  const type = isSelected ? "selected" : undefined;
                  return (
                    <div
                      key={id}
                      ref={isSelected ? props.targetRef : undefined}
                    >
                      <PlaylistItem
                        span={4}
                        type={type}
                        key={id}
                        onClick={() =>
                          setSelectedTrack(resourceId.videoId, trackNumber)
                        }
                      >
                        <TrackNumber type={type}>{trackNumber}</TrackNumber>
                        <Box
                          css={{
                            width: 300,
                            borderRadius: 6,
                            overflow: "hidden",
                            boxShadow: `0 2px 10px ${blackA.blackA7}`,
                          }}
                        >
                          <AspectRatioPrimitive.Root ratio={16 / 9}>
                            {thumbnails.medium && (
                              <Img
                                src={thumbnails.medium?.url}
                                width={thumbnails.medium.width}
                                height={thumbnails.medium.height}
                              />
                            )}
                          </AspectRatioPrimitive.Root>
                        </Box>
                        <TrackTitle>{title}</TrackTitle>
                      </PlaylistItem>
                    </div>
                  );
                })}
              </PlaylistGrid>
            </>
          )}
        </>
      )}
    </Container>
  );
};
