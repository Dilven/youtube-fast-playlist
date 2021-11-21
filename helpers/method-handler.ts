import Boom from "@hapi/boom";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const methods = [
  "get",
  "delete",
  "head",
  "options",
  "post",
  "put",
  "patch",
  "purge",
  "link",
  "unlink",
] as const;
type HttpMethod = typeof methods[number];

const isHttpMethod = (method?: string): method is HttpMethod =>
  !!method && methods.some((m) => m === method);

export const methodHandler =
  (handlers: Partial<Record<HttpMethod, NextApiHandler>>) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase();
    if (!isHttpMethod(method)) throw Boom.notFound();
    const handler = handlers[method];
    if (!handler) throw Boom.notFound();
    handler(req, res);
  };