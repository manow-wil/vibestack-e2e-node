const http = require("http");
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`vibestack-e2e ok | E2E_MSG=${process.env.E2E_MSG || "(vazio)"}`);
}).listen(port, () => console.log(`listening on ${port}`));
