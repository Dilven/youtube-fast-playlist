import { Boom } from "@hapi/boom";
import { methodHandler } from "helpers/method-handler";
import { withAsync } from "helpers/with-async";
import { ApiResponse } from "models/youtube";
import type { NextApiRequest, NextApiResponse } from "next";
import { YoutubeApi } from "services/youtube";

export default methodHandler({
  get: withAsync((req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
    const foo = YoutubeApi.fetchPlaylistItems(
      req.query.playlistId as string,
      Number(req.query.pages as string),
      req.query.pageToken as string
    );
    return foo;
  }),
});
