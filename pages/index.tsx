import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { styled } from "@stitches/react";
import { blackA } from "@radix-ui/colors";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PLAYLIST_ITEMS } from "constants/query-keys";
import { Pagination } from "@mantine/core";
import { ApiResponse } from "models/youtube";
import { YoutubeApi } from "services/youtube";
import { InternalApi } from "services/internal-api";

const Img = styled(Image, {
  objectFit: "cover",
  width: "100%",
  height: "100%",
});
const Box = styled("div", {});

export async function getServerSideProps() {
  const data = await YoutubeApi.fetchPlaylistItems();
  return {
    props: {
      data,
    },
  };
}

type Props = {
  data: ApiResponse;
};

const Home: NextPage<Props> = (props) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    props.data.nextPageToken
  );
  const { data, error } = useQuery(
    [PLAYLIST_ITEMS, page],
    () => InternalApi.fetchPlaylistItems(page, nextPageToken),
    { keepPreviousData: true }
  );

  useEffect(() => {
    setNextPageToken(data?.nextPageToken);
  }, [data?.nextPageToken]);
  if (error) return <p>error</p>;
  if (!data?.pageInfo) return <p>No data</p>;
  if (!data) return <p>No data</p>;
  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube fast playlist</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>My playlist</h1>
        <Pagination
          page={page}
          onChange={setPage}
          total={Math.round(
            data.pageInfo.totalResults / data.pageInfo.resultsPerPage
          )}
        />
        ;
        <ul className={styles.grid}>
          {data.items.map(({ id, snippet }) => {
            const { title, thumbnails, resourceId } = snippet;
            return (
              <li key={id} className={styles.card}>
                <a
                  href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
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
      </main>
      <footer className={styles.footer}>Playlist footer</footer>
    </div>
  );
};

export default Home;
