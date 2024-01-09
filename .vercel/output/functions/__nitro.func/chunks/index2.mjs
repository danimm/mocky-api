import { e as eventHandler } from './nitro/vercel.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';

const index = eventHandler(async (event) => {
  return { data: [] };
});

export { index as default };
//# sourceMappingURL=index2.mjs.map
