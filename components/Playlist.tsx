import { Loader, Notification, Pagination } from "@mantine/core";
import { blackA } from "@radix-ui/colors";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { Cross1Icon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import { PLAYLIST_ITEMS } from "constants/query-keys";
import { ApiResponse } from "models/youtube";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { InternalApi } from "services/internal-api";
import styles from "../styles/Home.module.css";

const Img = styled(Image, {
  objectFit: "cover",
  width: "100%",
  height: "100%",
});
const Box = styled("div", {});

type Props = {
  playlistId: string;
};
export const Playlist = (props: Props) => {
  const queryClient = useQueryClient();
  const [previousPage, setPreviousPage] = useState(1);
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const { data, error, isFetching } = useQuery(
    [PLAYLIST_ITEMS, page],
    async () => {
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
    },
    { keepPreviousData: true }
  );

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
    <>
      {isFetching ? (
        <Loader color="#CED4DA" size="xl" variant="bars" />
      ) : (
        <>
          {data && (
            <>
              <Pagination
                page={page}
                onChange={onChangePage}
                total={Math.ceil(
                  data.pageInfo.totalResults / data.pageInfo.resultsPerPage
                )}
              />
              <ul className={styles.grid}>
                {data.items.map(({ id, snippet }) => {
                  const { title, thumbnails, resourceId } = snippet;
                  return (
                    <li key={id} className={styles.card}>
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}&list=${props.playlistId}`}
                      >
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
                        <h3>{title}</h3>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
};
