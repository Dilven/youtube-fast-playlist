import axios from "axios";
import { getQueryParams } from "helpers/get-query-params";
import { ApiResponse } from "models/youtube";

export const MAX_RESULTS_PER_PAGE_API = 50;
const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

const fetchPlaylistItems = async (
  playlistId: string,
  pages: number,
  providedToken?: string
): Promise<ApiResponse[]> => {
  const baseParams = {
    part: "snippet",
    maxResults: MAX_RESULTS_PER_PAGE_API,
    playlistId,
    key: process.env.YOUTUBE_API_KEY,
  };
  let pageToken = providedToken;
  if (pages < 0) throw new Error("pages cannot be less then 0");
  let data: ApiResponse[] = [];
  for (let fetchedPages = 0; fetchedPages < pages; fetchedPages++) {
    const queryParams = getQueryParams({
      ...baseParams,
      pageToken,
    });
    const url = `${YOUTUBE_PLAYLIST_ITEMS_API}${queryParams}`;
    const response = await axios.get<ApiResponse>(url);
    pageToken = response.data.nextPageToken;
    data = [...data, response.data];
  }
  return data;
};

export const YoutubeApi = {
  fetchPlaylistItems,
};
