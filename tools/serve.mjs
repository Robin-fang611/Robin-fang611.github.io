// 本地预览：node tools/serve.mjs [port]
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer(async (req, res) => {
    try {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      let file = path.join(here, url);
      if (url.endsWith("/")) file = path.join(file, "index.html");
      let info = await stat(file).catch(() => null);
      if (info?.isDirectory()) {
        file = path.join(file, "index.html");
        info = await stat(file).catch(() => null);
      }
      if (!info) {
        res.writeHead(404, { "content-type": types[".html"] });
        res.end(await readFile(path.join(here, "404.html")).catch(() => "404"));
        return;
      }
      res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
      res.end(await readFile(file));
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`serving ${here} at http://127.0.0.1:${port}/`);
  });
