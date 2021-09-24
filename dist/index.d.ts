import { Plugin } from 'vite';

declare function inWorker(plugin: Plugin): Plugin;
interface ComlinkPluginOptions {
    /**
     * Enable type generation
     * @default false
     */
    types?: boolean;
    /**
     * Set import schema to use
     * @default comlink:
     */
    schema?: string;
    /**
     * Internal plugins that are used in worker build.
     *
     * Use only when you know what you do!
     */
    internal_worker_plugins?: string[];
    /**
     * Filename of type file
     * @default comlink-workers.d.ts
     */
    typeFile?: string;
    /**
     * Use module Worker in production
     * @default false
     */
    moduleWorker?: boolean;
}
declare function comlink({ moduleWorker, types, schema, typeFile, internal_worker_plugins, }?: ComlinkPluginOptions): Plugin;

export { comlink as default, inWorker };
