import configPromise from "@payload-config";
import { getPayload } from "payload";
/* eslint-disable @typescript-eslint/no-unused-vars */
export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
  });

  return Response.json({
    message: "This is an example of a custom route.",
  });
};
