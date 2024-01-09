import { collection, doc, getDoc, getDocs, orderBy, limit, startAfter, getFirestore, query, where, documentId, getCountFromServer } from '@firebase/firestore';
import { a as getRequestURL } from './nitro/vercel.mjs';
import { initializeApp } from '@firebase/app';

const useConverter = () => {
  const converter = {
    toFirestore: (data) => data,
    fromFirestore: (snap) => snap.data()
  };
  return converter;
};

function useFirestore(db, collectionName) {
  function useCollectionRef(...pathSegments) {
    return collection(db, collectionName, ...pathSegments).withConverter(useConverter());
  }
  function useDocumentRef(...pathSegments) {
    return doc(db, collectionName, ...pathSegments).withConverter(useConverter());
  }
  function getDocument(...pathSegments) {
    return getDoc(useDocumentRef(...pathSegments));
  }
  async function fetchSubCollection(docRef, path) {
    const subCollectionRef = collection(docRef, path).withConverter(useConverter());
    const snapshot = await getDocs(subCollectionRef);
    return snapshot.docs.map((doc2) => doc2.data());
  }
  function getDocsData(snapshot, transform) {
    return snapshot.docs.map((doc2) => {
      return transform ? transform(doc2) : doc2.data();
    });
  }
  function getDocData(snapshot) {
    return snapshot.data();
  }
  return {
    // Fetch Data
    useCollectionRef,
    useDocumentRef,
    getDocument,
    fetchSubCollection,
    // Parse Data
    getDocsData,
    getDocData
  };
}

const firebaseConfig = {
  apiKey: process.env.NITRO_FIREBASE_API_KEY,
  authDomain: process.env.NITRO_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NITRO_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NITRO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NITRO_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NITRO_FIREBASE_APP_ID,
  measurementId: process.env.NITRO_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

function useQueryPagination(options) {
  const queryOptions = [orderBy("created_at", "desc")];
  if (options.perPage)
    queryOptions.push(limit(options.perPage));
  if (options.startAfter)
    queryOptions.push(startAfter(options.startAfter));
  return queryOptions;
}

function usePaginator({ url, lastPositionId, options, totalCount }) {
  const numPages = Math.ceil(totalCount / options.perPage);
  const loadMore = new URL(url);
  loadMore.searchParams.set("page", lastPositionId);
  return {
    paginator: {
      count: totalCount,
      num_pages: numPages,
      per_page: options.perPage,
      has_next: options.perPage * 2 < totalCount,
      current_page: options.startAfter || "",
      load_more: loadMore,
      // TODO: remove hardcoded values
      translations: '{\\"load_more_label\\": \\"Mehr anzeigen\\", \\"progress_text\\": \\"{PROGRESS} von {COUNT} werden angezeigt.\\"}'
    }
  };
}

function useDB(event) {
  const db = getFirestore(app);
  async function fetchFromCollection(collectionName, options = {}) {
    var _a;
    const {
      useCollectionRef,
      useDocumentRef,
      getDocument,
      getDocsData,
      getDocData
    } = useFirestore(db, collectionName);
    const collectionRef = useCollectionRef();
    const metadataQuery = useDocumentRef("metadata");
    let lastDocument = null;
    if (options.startAfter)
      lastDocument = await getDocument(options.startAfter);
    const allDocumentsQuery = query(
      collectionRef,
      // TODO: remove this for generic use
      where("created_at", "!=", ""),
      ...useQueryPagination({ ...options, startAfter: lastDocument })
    );
    const countDocumentsQuery = query(collectionRef, where(documentId(), "!=", "metadata"));
    const [
      dataPromise,
      metadataPromise,
      totalCountPromise
    ] = await Promise.allSettled([
      getDocs(allDocumentsQuery),
      getDoc(metadataQuery),
      getCountFromServer(countDocumentsQuery)
    ]);
    const lastPosition = dataPromise.status === "fulfilled" ? dataPromise.value.docs.at(-1) : null;
    const totalCount = totalCountPromise.status === "fulfilled" ? totalCountPromise.value.data().count : 0;
    const data = dataPromise.status === "fulfilled" && !((_a = dataPromise.value) == null ? void 0 : _a.empty) ? getDocsData(dataPromise.value) : [];
    const metadata = metadataPromise.status === "fulfilled" && metadataPromise.value.exists() ? {
      ...getDocData(metadataPromise.value),
      ...usePaginator({
        url: event ? getRequestURL(event) : new URL(""),
        lastPositionId: lastPosition == null ? void 0 : lastPosition.ref.id,
        options,
        totalCount
      })
    } : null;
    return [data, metadata];
  }
  return { fetchFromCollection, db };
}

var AvailableMockData = /* @__PURE__ */ ((AvailableMockData2) => {
  AvailableMockData2["Downloads"] = "downloads";
  return AvailableMockData2;
})(AvailableMockData || {});

export { AvailableMockData as A, useDB as u };
//# sourceMappingURL=availableMockData.mjs.map
