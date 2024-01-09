import { d as defineEventHandler, g as getQuery, c as createError } from './nitro/vercel.mjs';
import { u as useDB, A as AvailableMockData } from './availableMockData.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import '@firebase/firestore';
import '@firebase/app';

const index = defineEventHandler(async (event) => {
  const { fetchFromCollection } = useDB(event);
  const { page = "", limit = 15 } = getQuery(event);
  const [downloads, metadata = {}] = await fetchFromCollection(AvailableMockData.Downloads, {
    startAfter: page,
    perPage: Number(limit)
  });
  if (!downloads)
    return createError({
      message: "No data found in the database or error fetching the data",
      statusCode: 404
    });
  return { downloads, ...metadata };
});

export { index as default };
//# sourceMappingURL=index.mjs.map
