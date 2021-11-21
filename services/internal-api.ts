import axios from "axios";
import { getQueryParams } from "helpers/get-query-params";
import { ApiResponse } from "models/youtube";

const fetchPlaylistItems = async (
  playlistId: string,
  pages?: number,
  pageToken?: string
): Promise<ApiResponse[]> => {
  const query = getQueryParams({
    playlistId,
    pages,
    pageToken,
  });
  const url = `/api/playlistitem${query}`;
  console.log("🚀 ~ file: internal-api.ts ~ line 16 ~ url", url);
  const { data } = await axios.get(url);
  return data;
};

export const InternalApi = {
  fetchPlaylistItems,
};
