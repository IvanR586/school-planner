const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.join(__dirname, 'dist');
const url = 'http://127.0.0.1:4174/';
function openBrowser() {
  const process = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { windowsHide: true, stdio: 'ignore' });
  process.on('error', () => console.log(`Open ${url} in your browser.`));
}
const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, url).pathname); }
  catch { response.writeHead(400); response.end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404); response.end('Not found'); return; }
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.end(data);
  });
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port 4174 is already in use. If the planner is running, open ${url}`);
  } else { console.error(error.message); }
  process.exitCode = 1;
});
server.listen(4174, '127.0.0.1', () => {
  console.log(`School planner: ${url}\nKeep this window open. Press Ctrl+C to stop.`);
  openBrowser();
});
