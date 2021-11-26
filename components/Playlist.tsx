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
import { PLAYLIST_ITEMS } from "constants/query-keys";
import { ApiResponse } from "models/youtube";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { InternalApi } from "services/internal-api";
import { MAX_RESULTS_PER_PAGE_API } from "services/youtube";
import { useStore } from "store";

const Img = styled(Image, {
  objectFit: "cover",
  width: "100%",
});
const Box = styled("div", {});

const PlaylistGrid = styled(Grid, {
  marginTop: "30px",
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
});

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

const TrackTitle = styled('h3', {
  maxWidth: '230px',
  margin: '0',
  display: 'block',
})
type Props = {
  playlistId: string;
  scrollableRef: MutableRefObject<null>;
  targetRef: MutableRefObject<any>;
};
export const Playlist = (props: Props) => {
  const queryClient = useQueryClient();
  const [previousPage, setPreviousPage] = useState(1);
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const autoplay = useStore(store => store.autoplay)
  const router = useRouter()
  const selectedTrackNumber = useStore((state) => state.selectedTrackNumber);
  const setSelectedTrack = useStore((state) => (selectedTrack?: string | undefined, selectedTrackNumber?: number | undefined) => {
    state.setSelectedTrack(selectedTrack, selectedTrackNumber);
    router.push(
      {
        query: {
          ...router.query,
          track: selectedTrack,
        },
      },
      undefined,
      { shallow: true }
    );
  });
  const getData = async () => {
    const pages = Math.max(page - previousPage, 1);
    const allItems = await InternalApi.fetchPlaylistItems(
      props.playlistId,
      pages,
      nextPageToken
    );
    const currentPageItems = allItems.at(-1);
    const restItems = allItems.slice(0, -1);
    restItems.forEach((items, index) => {
      queryClient.setQueryData<ApiResponse>(
        [PLAYLIST_ITEMS, previousPage + index + 1],
        () => items
      );
    });
    return currentPageItems;
  }
  const state = useStore((state) => state);
  const { data, error, isFetching } = useQuery(
    [PLAYLIST_ITEMS, page],
    getData,
    { keepPreviousData: true }
  );
  useEffect(() => {
    async function nextTrack() {

      if(!autoplay) return;
      if(state.trackStatus !== 'finish' || !selectedTrackNumber) return;
      const selectedTrackNumberPage = Math.ceil(selectedTrackNumber / MAX_RESULTS_PER_PAGE_API)
      const nextTrackIndex = selectedTrackNumber % MAX_RESULTS_PER_PAGE_API
      const nextTrackPage = nextTrackIndex === 0 ? selectedTrackNumberPage + 1 : selectedTrackNumberPage
      let tracks = queryClient.getQueryData<ApiResponse>([PLAYLIST_ITEMS, nextTrackPage])
      
      if(!tracks) {
        const [nextPageTracks] = await InternalApi.fetchPlaylistItems(
          props.playlistId,
          nextTrackPage,
          nextPageToken
          )
        queryClient.setQueryData([PLAYLIST_ITEMS, nextTrackPage], nextPageTracks)
        tracks = nextPageTracks
      } 
      const track = tracks?.items[nextTrackIndex]
      if(!track) return;
      if(selectedTrackNumberPage !== nextTrackPage) setPage(nextTrackPage)
      setSelectedTrack(track?.snippet.resourceId.videoId, selectedTrackNumber + 1)
    }
    nextTrack()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.trackStatus])
  const onChangePage = (selectedPage: number) => {
    setPreviousPage(page);
    setPage(selectedPage);
  };
  useEffect(() => {
    setNextPageToken(data?.nextPageToken);
  }, [data?.nextPageToken]);
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
          {(data && data.pageInfo) && (
            <>
              <Pagination
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
