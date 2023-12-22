import { Download, DownloadDoc } from "../types/download";

export default defineCachedEventHandler(async (event) => {
  const { fetchMockData, fetchSubCollection } = useDB();

    const querySnapshot = await fetchMockData<DownloadDoc>('downloads');
    let data: null | DownloadDoc = null

    for (const doc of querySnapshot.docs) {
        const downloads = await fetchSubCollection<Download>(doc.ref, 'downloads');
        data = { ...doc.data(), downloads };
    }

    return data;
}, { swr: true })
