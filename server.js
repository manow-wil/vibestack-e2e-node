const http = require("http");
const { Client } = require("pg");
const port = process.env.PORT || 3000;
http.createServer(async (req, res) => {
  if (req.url === "/db") {
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    try {
      await c.connect();
      const r = await c.query("select 1 as ok");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(r.rows[0]));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    } finally {
      c.end().catch(() => {});
    }
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`vibestack-e2e ok | E2E_MSG=${process.env.E2E_MSG || "(vazio)"}`);
}).listen(port, () => console.log(`listening on ${port}`));
