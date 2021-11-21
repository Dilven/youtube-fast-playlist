import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';

export async function getServerSideProps() {
  console.log("🚀 ~ file: index.tsx ~ line 10 ~ getServerSideProps ~ process.env.YOUTUBE_API_KEY", process.env.YOUTUBE_API_KEY)
  const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=PLPSk39C-ml8sAklFfKTlVJcGTpGiwugC4&key=${process.env.YOUTUBE_API_KEY}`)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

type Item = {
  id: string,
  snippet: {
    title: string,
    thumbnails: {
      default: { url: string, width: number, height: number }
      high: { url: string, width: number, height: number }
      maxres: { url: string, width: number, height: number }
      medium: { url: string, width: number, height: number }
      standard: { url: string, width: number, height: number }
    },
    resourceId: string
  }
}

type Props = {
  data: {
    items: Item[]
  }
}

const Home: NextPage<Props> = ({ data }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube fast playlist</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          My Talks
        </h1>
        <ul className={styles.grid}>
          {data.items.map(({ id, snippet }) => {
            const { title, thumbnails, resourceId } = snippet;  
            return (
              <li key={id} className={styles.card}>
                <a href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}>
                  <p>
                    {thumbnails.medium && <Image width={thumbnails.medium.width} height={thumbnails.medium.height} src={thumbnails.medium.url} alt="" />}
                  </p>
                  <h3>{title}</h3>
                </a>
              </li>
            )
          })}
        </ul>
      </main>
      <footer className={styles.footer}>
        Playlist footer
      </footer>
    </div>
  )
}

export default Home