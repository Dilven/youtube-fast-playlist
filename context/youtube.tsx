import { PLAYLIST_ITEMS } from "constants/query-keys";
import { ApiResponse } from "models/youtube";
import { useRouter } from "next/dist/client/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useQueryClient, useQuery } from "react-query";
import { InternalApi } from "services/internal-api";
import { MAX_RESULTS_PER_PAGE_API } from "services/youtube";
import { useStore } from "store";

export const YoutubeContext = createContext<{
  error: unknown;
  data: ApiResponse | undefined;
  isFetching: boolean;
  page: number;
  onChangePage: (selectedPage: number) => void;
  selectedTrackNumber?: number;
  nextTrack: () => Promise<void>;
  setSelectedTrack: (
    selectedTrack?: string | undefined,
    selectedTrackNumber?: number | undefined
  ) => void;
} | null>(null);

type Props = {
  children: ReactNode;
  playlistId: string;
};

export const YoutubeProvider = ({ children, playlistId }: Props) => {
  const queryClient = useQueryClient();
  const [previousPage, setPreviousPage] = useState(1);
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const autoplay = useStore((store) => store.autoplay);
  const router = useRouter();
  const selectedTrackNumber = useStore((state) => state.selectedTrackNumber);
  const setSelectedTrack = useStore(
    (state) =>
      (
        selectedTrack?: string | undefined,
        selectedTrackNumber?: number | undefined
      ) => {
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
      }
  );
  const getData = async () => {
    const pages = Math.max(page - previousPage, 1);
    const allItems = await InternalApi.fetchPlaylistItems(
      playlistId,
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
  };
  const state = useStore((state) => state);
  const { data, error, isFetching } = useQuery(
    [PLAYLIST_ITEMS, page],
    getData,
    { keepPreviousData: true }
  );

  async function nextTrack() {
    if (!selectedTrackNumber) return;
    const selectedTrackNumberPage = Math.ceil(
      selectedTrackNumber / MAX_RESULTS_PER_PAGE_API
    );
    const nextTrackIndex = selectedTrackNumber % MAX_RESULTS_PER_PAGE_API;
    const nextTrackPage =
      nextTrackIndex === 0
        ? selectedTrackNumberPage + 1
        : selectedTrackNumberPage;
    let tracks = queryClient.getQueryData<ApiResponse>([
      PLAYLIST_ITEMS,
      nextTrackPage,
    ]);

    if (!tracks) {
      const [nextPageTracks] = await InternalApi.fetchPlaylistItems(
        playlistId,
        nextTrackPage,
        nextPageToken
      );
      queryClient.setQueryData([PLAYLIST_ITEMS, nextTrackPage], nextPageTracks);
      tracks = nextPageTracks;
    }
    const track = tracks?.items[nextTrackIndex];
    if (!track) return;
    if (selectedTrackNumberPage !== nextTrackPage) setPage(nextTrackPage);
    setSelectedTrack(
      track?.snippet.resourceId.videoId,
      selectedTrackNumber + 1
    );
  }

  useEffect(() => {
    if (!autoplay) return;
    if (state.trackStatus !== "finish") return;
    nextTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.trackStatus]);
  const onChangePage = (selectedPage: number) => {
    setPreviousPage(page);
    setPage(selectedPage);
  };
  useEffect(() => {
    setNextPageToken(data?.nextPageToken);
  }, [data?.nextPageToken]);

  return (
    <YoutubeContext.Provider
      value={{
        isFetching,
        error,
        data,
        page,
        onChangePage,
        selectedTrackNumber,
        setSelectedTrack,
        nextTrack,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};
