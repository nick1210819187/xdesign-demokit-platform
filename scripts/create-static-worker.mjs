import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";

const html = await readFile("dist/index.html", "utf8");
const textTypes = new Map([
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
]);
const binaryTypes = new Map([
  [".png", "image/png"],
]);

async function collectAssets(dir, routePrefix) {
  const entries = await readdir(dir, { withFileTypes: true });
  const assets = {};

  for (const entry of entries) {
    const filePath = join(dir, entry.name);
    const routePath = posix.join(routePrefix, entry.name);
    if (entry.isDirectory()) {
      Object.assign(assets, await collectAssets(filePath, routePath));
      continue;
    }

    const ext = entry.name.slice(entry.name.lastIndexOf("."));
    if (textTypes.has(ext)) {
      assets[routePath] = {
        type: "text",
        mime: textTypes.get(ext),
        body: await readFile(filePath, "utf8"),
      };
    } else if (binaryTypes.has(ext)) {
      assets[routePath] = {
        type: "base64",
        mime: binaryTypes.get(ext),
        body: (await readFile(filePath)).toString("base64"),
      };
    }
  }

  return assets;
}

const assets = await collectAssets("dist/assets", "/assets");

const worker = `const html = ${JSON.stringify(html)};
const assets = ${JSON.stringify(assets)};

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const asset = assets[url.pathname];
    if (asset) {
      return new Response(asset.type === "base64" ? fromBase64(asset.body) : asset.body, {
        headers: {
          "content-type": asset.mime,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (url.pathname.includes(".") && url.pathname !== "/index.html") {
      return new Response("Not found", { status: 404 });
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};
`;

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", worker);
