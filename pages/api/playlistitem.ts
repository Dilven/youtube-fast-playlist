import { Boom } from "@hapi/boom";
import { methodHandler } from "helpers/method-handler";
import { withAsync } from "helpers/with-async";
import { ApiResponse } from "models/youtube";
import type { NextApiRequest, NextApiResponse } from "next";
import { YoutubeApi } from "services/youtube";

export default methodHandler({
  get: withAsync((
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
  ) => {
    console.log("🚀 ~ file: playlistitem.ts ~ line 14 ~ req.query.pageToken", req.query.pageToken)
    return  YoutubeApi.fetchPlaylistItems(undefined, req.query.pageToken as string)
  })
})
