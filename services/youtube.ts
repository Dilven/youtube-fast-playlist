import axios from "axios";
import { getQueryParams } from "helpers/get-query-params";
import { ApiResponse } from "models/youtube";

const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

const fetchPlaylistItems = async (page = 0, nextPageToken?: string): Promise<ApiResponse> => {
    console.log(
      "🚀 ~ file: index.tsx ~ line 33 ~ fetchPlaylistItems ~ page",
      page
    );
    const queryParams = getQueryParams({
      part: "snippet",
      maxResults: 50,
      playlistId: "PLPSk39C-ml8sAklFfKTlVJcGTpGiwugC4",
      key: process.env.YOUTUBE_API_KEY,
      pageToken: nextPageToken || undefined
    });
    const url = `${YOUTUBE_PLAYLIST_ITEMS_API}${queryParams}`;
    const { data } = await axios.get(url)
    return data
  };

export const YoutubeApi = {
  fetchPlaylistItems
}