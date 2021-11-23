import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { Playlist } from "components/Playlist";
import { Button, Center, SimpleGrid, TextInput } from "@mantine/core";
import { useForm, useScrollIntoView } from "@mantine/hooks";
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { YoutubeEmbed } from "components/YoutubeEmbed";
import { styled } from "@stitches/react";

const Main = styled("main", {
  paddingTop: "30px",
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const playlistId = (context.query.playlistId as string) || "";
  return {
    props: {
      playlistId,
    },
  };
}

type Props = {
  playlistId?: string;
};

const Home: NextPage<Props> = (props) => {
  const [playlistToShow, setPlaylistToShow] = useState(props.playlistId);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView();
  const form = useForm({
    initialValues: {
      playlistId: "",
    },
    validationRules: {
      playlistId: (value) => value.trim().length >= 2,
    },
  });

  const router = useRouter();

  return (
    <Main>
      <Head>
        <title>Youtube fast playlist</title>
      </Head>

      <main>
        {playlistToShow ? (
          <SimpleGrid cols={2} spacing="sm">
            <YoutubeEmbed scrollIntoView={scrollIntoView} />
            <Playlist
              scrollableRef={scrollableRef}
              targetRef={targetRef}
              playlistId={playlistToShow}
            />
          </SimpleGrid>
        ) : (
          <Center>
            <form
              onSubmit={form.onSubmit((values) => {
                router.push(
                  {
                    query: {
                      playlistId: values.playlistId,
                    },
                  },
                  undefined,
                  { shallow: true }
                );
                return setPlaylistToShow(values.playlistId);
              })}
            >
              <TextInput
                value={form.values.playlistId}
                onChange={(event) =>
                  form.setFieldValue("playlistId", event.currentTarget.value)
                }
                required
                label="PlaylistId"
                id="input-demo"
                placeholder="Playlist id"
              />
              <Button type="submit">Show</Button>
            </form>
          </Center>
        )}
      </main>
    </Main>
  );
};

export default Home;
