import { d as defineEventHandler, c as createError } from './nitro/vercel.mjs';
import { u as useDB, A as AvailableMockData } from './availableMockData.mjs';
import { collection, documentId, where, query, getDocs, writeBatch } from '@firebase/firestore';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import '@firebase/app';

const index_delete = defineEventHandler(async (event) => {
  const { db } = useDB();
  const { Downloads } = AvailableMockData;
  try {
    const q = query(collection(db, Downloads), where(documentId(), "!=", "metadata"));
    const docs = await getDocs(q);
    const batch = writeBatch(db);
    docs.docs.forEach((downloadDoc) => batch.delete(downloadDoc.ref));
    await batch.commit();
    return { statusCode: 200 };
  } catch (error) {
    return createError({
      message: error.message,
      statusCode: 500
    });
  }
});

export { index_delete as default };
//# sourceMappingURL=index.delete.mjs.map
