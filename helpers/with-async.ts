import Boom from "@hapi/boom";
import { logger } from "infra/logger";
import { NextApiRequest, NextApiResponse } from "next";

export const withAsync = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<unknown> | unknown
) => {
  return async <R extends NextApiRequest>(req: R, res: NextApiResponse) => {
    try {
      const result = await handler(req, res);
      if (result === undefined) {
        logger.error(
          `Handler returned undefined. If you intended to return an empty response, return null instead. ${handler
            .toString()
            .slice(0, 50)}`
        );
        return res.status(500).end();
      }

      if (result === null) {
        return res.status(204).end();
      }

      return res.json(result);
    } catch (err) {
      logger.error(err instanceof Error ? err : { err });
      if (Boom.isBoom(err)) {
        Object.entries(err.output.headers).forEach(
          ([key, val]) => val && res.setHeader(key, val)
        );
        return res.status(err.output.statusCode).json(err.output.payload);
      } else {
        return res.status(500).json(err);
      }
    }
  };
};
