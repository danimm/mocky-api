import { DownloadDoc, DownloadMetadata } from "./download";
import { TransformCallback } from "./common/queryOptions";
import { CoordinatesPopup } from "./evp-map/coordinates-popup";
import { SearchAddress } from "./evp-map/search_addresses";

// Muss match the name of the collection in the database
export enum AvailableMockData {
    Downloads = 'downloads',
    EvpMap_coordinates = 'coordinates_popup',
    EvpMap_search_addresses = 'search_addresses',
}

export interface MockDataMap {
    [AvailableMockData.Downloads]: [DownloadDoc, DownloadMetadata];
    [AvailableMockData.EvpMap_coordinates]: [CoordinatesPopup];
    [AvailableMockData.EvpMap_search_addresses]: [SearchAddress];
}

// TODO: Type transform option
export type FetchDataResponse<T extends AvailableMockData> = {
    [K in AvailableMockData]: K extends T ? MockDataMap[K] : never;
} & {
    transform?: 'transform' extends keyof OptionsWithTransform<T> ? ReturnType<OptionsWithTransform<T>['transform']> : never;
};

type OptionsWithTransform<T extends AvailableMockData> = {
    transform: TransformCallback<MockDataMap[T][0]>;
};
