const http = require("http");
const { Client } = require("pg");
const { createClient } = require("redis");
const port = process.env.PORT || 3000;
function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}
http.createServer(async (req, res) => {
  if (req.url === "/db") {
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    try {
      await c.connect();
      const r = await c.query("select 1 as ok");
      json(res, 200, r.rows[0]);
    } catch (e) {
      json(res, 500, { error: e.message });
    } finally {
      c.end().catch(() => {});
    }
    return;
  }
  if (req.url === "/redis") {
    const rc = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 5000, reconnectStrategy: false } });
    rc.on("error", () => {});
    try {
      await rc.connect();
      await rc.set("qa", "ok-" + Date.now());
      const v = await rc.get("qa");
      json(res, 200, { ok: v });
    } catch (e) {
      json(res, 500, { error: e.message });
    } finally {
      rc.quit().catch(() => {});
    }
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`vibestack-e2e ok | E2E_MSG=${process.env.E2E_MSG || "(vazio)"}`);
}).listen(port, () => console.log(`listening on ${port}`));
