//https://nitro.unjs.io/config
export default defineNitroConfig({
    preset: "deno-deploy",
    storage: {
        db: {
            driver: 'fs',
            base: './data/db'
        }
    }
});
