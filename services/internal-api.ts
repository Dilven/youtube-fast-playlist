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
  const { data } = await axios.get(url);
  return data;
};

export const InternalApi = {
  fetchPlaylistItems,
};
