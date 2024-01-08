# Mocky API - Patternlab web component library mock data

This project is a small backend target for the creation of the test data API of our Energie 360 web component library based on Patternlab.

It is based on nitro, a backend that is part of the open source [unJS](https://unjs.io/) (universal JS) Github organisation and powers other well-known open source frameworks such as [Nuxt](https://nuxt.com/) or [Analog](https://analogjs.org/).

It is a minimalist backend, with file-based routing and written entirely in typescript.

Look at the [Nitro documentation](https://nitro.unjs.io/) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

## Development Server

Start the development server on <http://localhost:3000>

```bash
npm run dev

# yarn
yarn run dev

# pnpm
pnpm run dev
```

## Development flow

To create a new route, simply create a file in the routes folder.

This will become a new endpoint with the name given to the file. [See the Nitro routing documentation](https://nitro.unjs.io/guide/routing).

The database we use is hosted on [Firebase Firestore](https://firebase.google.com/docs/firestore), a No-SQL database based on documents and collections.

Although the firestore Web SDK has improved a lot, I've created a small utility to make it a bit easier to use: `useDB.ts`

Its use is very simple, we only have to send it the name of the collection from which we want to extract the data through the `AvailableMockData` *enum*.

```typescript
export enum AvailableMockData {
    Downloads = 'downloads',
}

export interface MockDataMap {
    [AvailableMockData.Downloads]: [DownloadDoc, DownloadMetadata]
}
````

This way we avoid having magic strings, we guarantee strict typing and we can also define the return type of the data, which will be read through the `MockDataMap`.

Currently, useDB is designed to **return a tuple** consisting of the data itself in the first position and the (optional) metadata in the second.

This behaviour is likely to change in the future.

There is also a premature implementation (currently under development) of an optional callback transform in case we want to directly modify the data coming from the database.

## Production

Build the application for production:

```bash
# npm
npm run build

# yarn
yarn run build

# pnpm
pnpm run build
```

Locally preview production build:

```bash
npm run preview
```

## Deployment

Check out the [deployment documentation](https://nitro.unjs.io/deploy) for more information.
