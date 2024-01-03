import { DownloadDoc, DownloadMetadata } from "../../types/download";
import { AvailableMockData } from "../../types/availableMockData";

export default defineCachedEventHandler(async (event) => {
  const { fetchFromCollection } = useDB();

    const [
        data,
        metadata
    ] = await fetchFromCollection<DownloadDoc, DownloadMetadata>(AvailableMockData.Downloads);

    return { data, metadata }
}, { swr: false })
