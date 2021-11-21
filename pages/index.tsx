import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { styled } from "@stitches/react";
import { blackA } from "@radix-ui/colors";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PLAYLIST_ITEMS } from "constants/query-keys";
import { Loader, Pagination } from "@mantine/core";
import { ApiResponse } from "models/youtube";
import { YoutubeApi } from "services/youtube";
import { InternalApi } from "services/internal-api";
import { useRouter } from "next/dist/client/router";

const Img = styled(Image, {
  objectFit: "cover",
  width: "100%",
  height: "100%",
});
const Box = styled("div", {});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(
    "🚀 ~ file: index.tsx ~ line 25 ~ getServerSideProps ~ params",
    context.query
  );
  const playlistId = context.query.playlistId as string;
  // const data = await YoutubeApi.fetchPlaylistItems(playlistId, 1, undefined);

  return {
    props: {
      // data,
      playlistId,
    },
  };
}

type Props = {
  data: ApiResponse;
  playlistId: string;
};

const Home: NextPage<Props> = (props) => {
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
  // if (error) return <p>error</p>;
  // if (!data?.pageInfo) return <p>No data</p>;
  // if (!data) return <p>No data</p>;
  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube fast playlist</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>My playlist</h1>
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
      </main>
      <footer className={styles.footer}>Playlist footer</footer>
    </div>
  );
};

export default Home;
