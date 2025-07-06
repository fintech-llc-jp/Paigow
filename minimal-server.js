const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

console.log('🚀 Starting Paigow server on port', PORT);

const indexHtml = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache'
  });
  res.end(indexHtml);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Paigow game server running on http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});