import {
  rollup
} from "./chunk-R4O32IJ7.mjs";

// src/index.ts
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

// node_modules/rollup/dist/es/rollup.js
import "path";
import "crypto";
import "fs";
import "events";

// src/index.ts
function getAssetHash(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
}
function inWorker(plugin) {
  plugin._inWorker = true;
  return plugin;
}
var internal_schema = "comlink-internal:";
function comlink({
  moduleWorker = false,
  types = false,
  schema = "comlink:",
  typeFile = "comlink-workers.d.ts",
  internal_worker_plugins = [
    "alias",
    "vite:modulepreload-polyfill",
    "vite:resolve",
    "vite:esbuild",
    "vite:json",
    "vite:wasm",
    "vite:asset",
    "vite:define",
    "commonjs",
    "vite:data-uri",
    "rollup-plugin-dynamic-import-variables",
    "asset-import-meta-url",
    "vite:import-analysis",
    "vite:esbuild-transpile",
    "vite:terser",
    "vite:reporter",
    "load-fallback"
  ]
} = {}) {
  let typesFile = "";
  let data = {};
  let isBuild = false;
  let config;
  let timer = null;
  function createTypes() {
    const data_json = "//" + JSON.stringify(data);
    const types2 = Object.entries(data).map(([id, real]) => {
      if (real.endsWith(".ts"))
        real = real.slice(0, real.length - 3);
      if (real[0] == "/" || real[0] == "\\")
        real = "." + real;
      if (real.startsWith(config.root))
        real = "." + real.slice(config.root.length);
      return moduleDefinition(id, real);
    }).join("");
    writeFileSync(typesFile, data_json + types2);
  }
  return inWorker({
    name: "comlink",
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.command === "build";
      config = resolvedConfig;
      if (types) {
        typesFile = join(config.root, typeFile);
        if (!isBuild && existsSync(typesFile)) {
          data = JSON.parse(readFileSync(typesFile, "utf-8").split("\n")[0].slice(2));
        }
      }
    },
    async resolveId(id, importer) {
      var _a;
      if (id.startsWith(internal_schema)) {
        return id;
      }
      if (!id.startsWith(schema)) {
        return;
      }
      const realPath = id.slice(schema.length);
      const realID = (_a = await this.resolve(realPath, importer)) == null ? void 0 : _a.id.slice(config.root.length);
      if (!realID)
        throw new Error(`Worker module ${realPath} not found`);
      if (!isBuild && types) {
        if (data[id] != realID) {
          data[id] = realID;
          if (!timer) {
            timer = setTimeout(() => {
              createTypes();
              timer = null;
            }, 2e3);
          }
        }
      }
      return schema + realID;
    },
    buildEnd() {
      if (types) {
        createTypes();
      }
    },
    async load(id) {
      if (id.startsWith(schema)) {
        const baseId = `${internal_schema}${id.slice(schema.length)}`;
        let url = `/@id/${baseId}`;
        if (isBuild && !moduleWorker) {
          const bundle = await rollup({
            input: baseId,
            plugins: [
              ...config.plugins.filter((v) => v._inWorker || internal_worker_plugins.includes(v.name)),
              {
                name: "worker-env",
                resolveImportMeta(prop, ctx) {
                  if (prop !== "url")
                    return null;
                  return `new URL('${ctx.chunkId}', location.origin + '${config.base[0] == "/" ? "" : "/"}${config.base}').href`;
                }
              }
            ]
          });
          let code;
          try {
            const { output } = await bundle.generate({
              format: "iife",
              sourcemap: config.build.sourcemap
            });
            code = output[0].code;
          } finally {
            await bundle.close();
          }
          const content = Buffer.from(code);
          const p = id.split(/\/|\\/g);
          const b = p[p.length - 1].split(".");
          const basename = b.slice(0, b.length - 1).join(".");
          const contentHash = getAssetHash(content);
          const fileName = join(config.build.assetsDir, `${basename}.${contentHash}.js`);
          url = `__VITE_ASSET__${this.emitFile({
            fileName,
            type: "asset",
            source: code
          })}__`;
        }
        if (isBuild && moduleWorker) {
          url = baseId;
        }
        return `
          import { wrap } from 'comlink'

          let workers = []

          if (import.meta.hot) {
            import.meta.hot.dispose((data) => {
              workers.forEach(worker => worker.terminate())
            })
          }

          export default () => {
            const worker = new Worker('${url}'${!isBuild || moduleWorker ? ", {type: 'module'}" : ""})
            ${!isBuild ? "workers.push(worker)" : ""}
            return wrap(worker)
          }
        `;
      }
      if (id.startsWith(internal_schema)) {
        return `
          // Dev-Vite env
          ${!isBuild ? "import '/@vite/env'" : ""}
          import { expose } from 'comlink'
          import * as m from '${id.slice(internal_schema.length)}'
          
          expose(m)
        `;
      }
    }
  });
}
function moduleDefinition(id, real) {
  return `
declare module "${id}" {
  const mod: () => import("comlink").Remote<typeof import("${real}")>
  export default mod
}
`;
}
export {
  comlink as default,
  inWorker
};
/*
  @license
	Rollup.js v2.56.3
	Mon, 23 Aug 2021 05:06:39 GMT - commit c41d17ceedfa6c1d7430da70c6c80d86a91e9434


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
