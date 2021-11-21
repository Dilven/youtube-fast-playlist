import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Playlist } from "components/Playlist";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import { useRouter } from "next/dist/client/router";

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
    <div className={styles.container}>
      <Head>
        <title>Youtube fast playlist</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>My playlist</h1>
        {playlistToShow ? (
          <Playlist playlistId={playlistToShow} />
        ) : (
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
        )}
      </main>
      <footer className={styles.footer}>Playlist footer</footer>
    </div>
  );
};

export default Home;
