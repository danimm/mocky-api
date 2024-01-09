# Mocky API - Patternlab web component library mock data

This project is a small backend target for the creation of the test data API of our [Energie 360 web component library](https://e360-patternlab.web.app) based on [Patternlab](https://patternlab.io/).

It is based on **Nitro**, a Node Backend that is part of the open source [unJS](https://unjs.io/) (universal JS) Github organisation and powers other well-known open source frameworks such as [Nuxt](https://nuxt.com/) or [Analog](https://analogjs.org/).

It is a minimalist backend, that can run the same code base in almost any posting environment (Node, Workers, Edge functions, Bun...) with file-based routing and written entirely in typescript.

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
# npm
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
    Magazine = 'magazine',
}

export interface MockDataMap {
    ...
    [AvailableMockData.Downloads]: [DownloadDoc, DownloadMetadata];
    [AvailableMockData.Magazine]: [MagazineDoc];
    ...
}
````

This way we avoid having magic strings, we guarantee strict typing and we can also define the return type of the data, which will be read through the `MockDataMap`.

Currently, useDB is designed to **return a tuple** consisting of the data itself in the first position and the (optional) metadata in the second.

This behaviour is likely to change in the future.

WIP 🚧 There is also a premature implementation of an optional callback transform in case we want to directly modify the data coming from the database.

### Auto imports

It also provides a number of auto-imported utilities ([check nitro documentation](https://nitro.unjs.io/guide/auto-imports)) that can be used directly inside our routes or utilities (with type safety of course), but they will not be included in the final bundle if we don't make use of them: they will only be available globally during development.

Adding of course the utilities that we develop ourselves: any file that we create inside the `utils` folder, will also be globally accessible as one of the framework's own utilities would be.

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
# npm
npm run preview

# yarn
yarn run preview

# pnpm
pnpm run preview
```

## Deployment

Check out the [deployment documentation](https://nitro.unjs.io/deploy) for more information.
