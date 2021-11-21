import axios from "axios"
import { getQueryParams } from "helpers/get-query-params"
import { ApiResponse } from "models/youtube"

const fetchPlaylistItems = async (page = 0, nextPageToken?: string): Promise<ApiResponse> => {
    const query = getQueryParams({
        page: page,
        pageToken: nextPageToken || undefined
      })
      const url = `/api/playlistitem${query}`
      console.log("🚀 ~ file: internal-api.ts ~ line 11 ~ fetchPlaylistItems ~ url", url)
    const { data } = await axios.get(url)
    return data;
}

export const InternalApi = {
    fetchPlaylistItems
}