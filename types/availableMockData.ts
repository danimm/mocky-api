import { DownloadDoc, DownloadMetadata } from "./download";
import { TransformCallback } from "./common/queryOptions";

export enum AvailableMockData {
    Downloads = 'downloads',
}

export interface MockDataMap {
    [AvailableMockData.Downloads]: [DownloadDoc, DownloadMetadata]
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
